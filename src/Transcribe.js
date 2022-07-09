import { useState } from "react";
import Form from 'react-bootstrap/Form';
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";


function Transcribe() {
  const [audioUpload, setAudioUpload] = useState(null);
  const [audioURL, setAudioURL] = useState('');

  const uploadAudio = () => {
    console.log(audioUpload)
    if(audioUpload === null) return; //put error message
    const audioRef = ref(storage, `${audioUpload + v4()}`)
    uploadBytes(audioRef, audioUpload).then(() => {
     console.log(audioRef)
     getDownloadURL(audioRef).then((url) => {
      console.log(url)
      setAudioURL(url) 
     })
    })
  }

  return (
    <>
      <Form.Group controlId="formFileLg" className="mb-3">
        <Form.Label>Large file input example</Form.Label>
        <Form.Control type="file" size="lg" onChange={(event) => setAudioUpload(event.target.files[0])} />
      </Form.Group>
      <button onClick={uploadAudio}>Upload Audio</button>
    </>
  );
}

export default Transcribe;