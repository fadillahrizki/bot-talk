import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { ChtBot } from "../views/ChtBot";
import { BotVoice } from "../views/BotVoice";
const Pages = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route exact path="/" element={<BotVoice />} />
        <Route exact path="/ChatBot" element={<ChtBot />} />
      </Routes>

      {/* <Footer /> */}
    </>
  );
};

export default Pages;
