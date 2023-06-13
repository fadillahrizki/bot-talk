import { Configuration, OpenAIApi } from "openai";
import React, { useState, useEffect, useRef } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export const BotVoice = () => {
  const [selecttedlang, setselectedLang] = useState("id-ID");
  const [message, setMessage] = useState("");
  const [people, setPeople] = useState("ME");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { message: "Keyboard mu rusak? Pakai Fitur Voice ini", people: "Bot" },
  ]);
  const messagesEndRef = useRef(null);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis({ lang: selecttedlang });
  const [btnIsHold, setbtnIsHold] = useState(false);

  //PAGE ----------------
  const [voicetotext, setVoicetoText] = useState(true);
  const [voicetovoice, setVoiceToVoice] = useState(false);

  //ENV APIKEY OPENAI ----------------
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  delete configuration.baseOptions.headers['User-Agent'];
  const openai = new OpenAIApi(configuration);

  const changePage = (text, voice) => {
    if (text === true && voice === false) {
      setVoicetoText(true);
      setVoiceToVoice(false);
      return;
    }

    if (text === false && voice === true) {
      setVoicetoText(false);
      setVoiceToVoice(true);
      return;
    }
  };

  //START SPEECH ----------------
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, lang: selecttedlang });
  };

  //STOP SPEECH ----------------
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  //ON BUTTON HOLD ----------------
  const onMouseDown = () => {
    setbtnIsHold(true);
    setTimeout(() => {
      if (btnIsHold) {
        // do something
      }
    }, 1000); //
    resetTranscript();
    startListening();
  };

  //ON BUTTON HOLD UP ----------------
  const onMouseUpText = async () => {
    setbtnIsHold(false);
    stopListening();
    if (transcript === "") {
      return;
    }

    //DISPLAY MY CHT ----------------
    const currentMessages = [...messages, { message: transcript, people }];
    setMessages(currentMessages);
    setMessage("");
    setIsLoading(true);

    //->OPENAI
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: transcript,
      temperature: 0,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    setIsLoading(false);
    //DISPLAY RESPONSE CHT BOT ----------------
    setMessages([
      ...currentMessages,
      { message: response.data.choices[0].text, people: "Bot" },
    ]);
  };

  //ON BUTTON HOLD UP ----------------
  const onMouseUpVoice = async () => {
    setbtnIsHold(false);
    stopListening();
    if (transcript === "") {
      return;
    }

    //->OPENAI
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: transcript,
      temperature: 0,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    setIsLoading(false);

    speak({ text: response.data.choices[0].text });
  };

  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-7 content">
            <div className="row px-3 py-3 justify-content-center ">
              <div className="col">
                <button
                  className="btn"
                  onClick={() => changePage(true, false)}
                  style={{ width: "100%", color: voicetotext ? "#333" : "" , background: voicetotext ? "white" : ""}}
                >
                  Voice to Text
                </button>
                {/* {<Speech text="This library is awesome!" />} */}
              </div>
              <div className="col">
                <button
                  className="btn"
                  onClick={() => changePage(false, true)}
                  style={{
                    width: "100%",
                    color: voicetovoice ? "#333" : "",
                    background: voicetovoice ? "white" : ""
                  }}
                >
                  Voice to Voice
                </button>
              </div>
            </div>

            {/* PAGE VOICE TO TEXT --------------- */}
            {voicetotext ? (
              <div>
                <div
                  className="row content2 p-3"
                  ref={messagesEndRef}
                  style={{ height: "70vh" }}
                >
                  <div className="col-md-12 p-4 ">
                    {messages.map((message, index) => (
                      <div key={index}>
                        <div
                          className={`row ${
                            message.people === "ME"
                              ? "d-flex justify-content-end"
                              : ""
                          } `}
                        >
                          <div
                            className={`col-md-12 my-3 p-2 ${
                              message.people === "ME"
                                ? "text-end"
                                : "text-start"
                            } `}
                            style={{
                              borderRight:
                                message.people === "ME"
                                  ? "2px solid #F24C3D"
                                  : "none",
                              borderLeft:
                                message.people !== "ME"
                                  ? "2px solid #F24C3D"
                                  : "none",
                              maxWidth: "50vh",
                            }}
                          >
                            <div className="pb-3 fw-bold">{message.people}</div>
                            <div style={{ wordWrap: "break-word" }}>
                              <p key={index}>{message.message}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading ? (
                      <div
                        className="spinner-border text-warning"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="container">
                    <div className="col-md-12">
                      <div className="form-inline">
                        <form>
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              autoComplete="off"
                              name="message"
                              disabled={isLoading}
                              value={transcript}
                              onChange={(e) => setMessage(e.target.value)}
                              className="form-control"
                              placeholder="Pesan.."
                              readOnly
                            />
                          </div>
                        </form>
                      </div>
                      {/* <p>Microphone: {listening ? "on" : "off"}</p> */}
                      <button
                        style={{
                          width: "200px",
                          background: btnIsHold ? "#F24C3D" : "",
                        }}
                        className="btn"
                        onMouseDown={onMouseDown}
                        onTouchStart={onMouseDown}
                        onMouseUp={onMouseUpText}
                        onTouchEnd={onMouseUpText}
                      >
                        Hold to Talk
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="">
                  <img
                    src="https://cdn.discordapp.com/attachments/1083786029435191356/1096105703166464111/image-removebg-preview.png"
                    alt=""
                    width="200"
                    style={{ opacity: "0.2" }}
                    className="img-fluid mt-5"
                  />
                </div>
                <div className="">
                  <p>{transcript}</p>
                </div>
                <button
                  style={{
                    marginTop: "1600vh",
                    width: "200px",
                    background: btnIsHold ? "#F24C3D" : "",
                  }}
                  className="btn mt-3"
                  onMouseDown={onMouseDown}
                  onTouchStart={onMouseDown}
                  onMouseUp={onMouseUpVoice}
                  onTouchEnd={onMouseUpVoice}
                >
                  Hold to Talk
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
