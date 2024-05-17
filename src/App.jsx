import { useState } from 'react'
import './App.css'
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import { FloatingLabel, Form } from 'react-bootstrap'
import { Button, Container, Grid } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';

function App() {
  const [input, setInput] = useState('')
  const [value, setValue] = useState()
  const key = 'AIzaSyAL1_Hq42CKMT6JNqtj4it1DDgtUPPAgk4'
  const genAI = new GoogleGenerativeAI(key)

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  async function run() {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [
            { text: `${input}\n` },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(input);
    console.log(result.response.text())
    const text = result.response.text()
    // const format = text.replace(/(?:\r\n|\r|\n)/g, '<br/>')
    // console.log(format)
    // const format = "<p>" + text.replace(/\n/g, "</p><p>") + "</p>"
    setValue(text)
  }

  function handle(e) {
    setInput(e.target.value)
  }

  return (

    <>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <FloatingLabel controlId="floatingPassword" label="Pergunte algo">
            <Form.Control onChange={handle} value={input} type="text" placeholder="Password" />
          </FloatingLabel>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={() => run()} variant="contained" endIcon={<SendIcon />}>
            Enviar
          </Button>
        </Grid>
      </Grid>
      
      <Container maxWidth="md">
        <p>
          {value}
        </p>
      </Container>
    </>
  )
}

export default App
