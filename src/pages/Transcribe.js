import { useState } from "react";
import Loader from "../components/Loader";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { storage } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

function Transcribe() {
  const [audioUpload, setAudioUpload] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const generateTranscript = (url) => {
    const axios = require("axios");
    const audioURL = url;
    const APIKey = process.env.REACT_APP_API_KEY;
    const refreshInterval = 5000;
  
    const assembly = axios.create({
      baseURL: "https://api.assemblyai.com/v2",
      headers: {
        authorization: APIKey,
        "content-type": "application/json",
      },
    });
  
    const getTranscript = async () => {
      const response = await assembly.post("/transcript", {
        audio_url: audioURL,
      });
  
    // Interval for checking transcript completion
      const checkCompletionInterval = setInterval(async () => {
        const transcript = await assembly.get(`/transcript/${response.data.id}`);
        const transcriptStatus = transcript.data.status;
  
        if (transcriptStatus !== "completed") {
          console.log(`Transcript Status: ${transcriptStatus}`);
          if(transcriptStatus === "error") {
            setIsLoading(false);
            setTranscript(`Error: ${transcript.data.error}`)
            return;
          }
        } else if (transcriptStatus === "completed") {
          console.log("\nTranscription completed!\n");
          let transcriptText = transcript.data.text;
          setTranscript(transcriptText);
          clearInterval(checkCompletionInterval);
          setIsLoading(false);
        }
      }, refreshInterval);
    }
    getTranscript();
  }

  const uploadAudio = () => {
    if(audioUpload === null) {
      setErrMessage('Please select a File')
      return; 
    } 

    setIsLoading(true);
    setTranscript('');
    setErrMessage('')

    const audioRef = ref(storage, `${audioUpload + v4()}`)
    uploadBytes(audioRef, audioUpload).then(() => {
     getDownloadURL(audioRef).then((url) => {
      generateTranscript(url)
     })
    }) 
  }

  return (
    <Container>     
      <Row> 
        <Col lg={4} id="upload-intro">
          <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Control type="file" size="lg" onChange={(event) => setAudioUpload(event.target.files[0])} />
          </Form.Group>
          <Button variant="primary" size="lg" onClick={uploadAudio} disabled={isLoading}>Get Transcript</Button>
          {errMessage && (
            <p>{errMessage}</p>
          )}
        </Col>

        <Col lg={8} >
          {isLoading ? (
            <div id="spinners" className="fetch">
              <p>...Retrieving Transcript. This may take a few minutes...</p>
              <Loader />
            </div>
          ) : 
            <p className="fetch" id="transcript">{transcript}</p>
          }
        </Col>
      </Row>
    </Container>
  );
}

export default Transcribe;