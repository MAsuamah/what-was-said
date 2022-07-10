import { useState } from "react";
import Form from 'react-bootstrap/Form';
import { storage } from "./utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

function Transcribe() {
  const [audioUpload, setAudioUpload] = useState(null);
  const [transcript, setTranscript] = useState('');

  const generateTranscript = (url) => {

    const axios = require("axios")
    const audioURL = url
    const APIKey = process.env.REACT_APP_API_KEY
    const refreshInterval = 5000
  
    // Setting up the AssemblyAI headers
    const assembly = axios.create({
      baseURL: "https://api.assemblyai.com/v2",
      headers: {
        authorization: APIKey,
        "content-type": "application/json",
      },
    })
  
    const getTranscript = async () => {
      // Sends the audio file to AssemblyAI for transcription
      const response = await assembly.post("/transcript", {
        audio_url: audioURL,
      })
  
    // Interval for checking transcript completion
      const checkCompletionInterval = setInterval(async () => {
        const transcript = await assembly.get(`/transcript/${response.data.id}`)
        const transcriptStatus = transcript.data.status
  
        if (transcriptStatus !== "completed") {
          console.log(`Transcript Status: ${transcriptStatus}`)
        } else if (transcriptStatus === "completed") {
          console.log("\nTranscription completed!\n")
          let transcriptText = transcript.data.text
          setTranscript(transcriptText)
          clearInterval(checkCompletionInterval)
        }
      }, refreshInterval)
    }

    getTranscript()
  }

  const uploadAudio =  () => {
    setTranscript('')
    console.log(audioUpload)
    if(audioUpload === null) return; //put error message
    const audioRef = ref(storage, `${audioUpload + v4()}`)
    uploadBytes(audioRef, audioUpload).then(() => {
     getDownloadURL(audioRef).then((url) => {
      generateTranscript(url)
     })
    })
  }

  return (
    <>
      <Form.Group controlId="formFileLg" className="mb-3">
        <Form.Control type="file" size="lg" onChange={(event) => setAudioUpload(event.target.files[0])} />
      </Form.Group>
      <button onClick={uploadAudio}>Upload Audio</button>
      <p>{transcript}</p>
    </>
  );
}

export default Transcribe;