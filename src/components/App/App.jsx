import React, { useState, useRef } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import AppBar from "../AppBar/AppBar";
import WorkStats from "../WorkStats/WorkStats";
import "./App.css";

function App() {
  const [inputURL, setInputURL] = useState("");
  const [ficData, setFicData] = useState("");
  const headerRef = useRef(null);

  /**
   * Handles form submission when user clicks submit button. Will strip the fic ID from the given url and
   *  make an axios request for the fic info
   * @param {*} e event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Trim the id from the provided url, the id will be between works/id/chapters if the work has multiple chapters,
    //  or after works/ if it is a single chapter work
    let ficID;
    if (inputURL.includes("/chapters")) {
      ficID = inputURL.substring(
        inputURL.indexOf("works/") + 6,
        inputURL.indexOf("/chapters")
      );
    } else {
      ficID = inputURL.substring(inputURL.indexOf("works") + 6);
    }

    // Send a request to the server
    axios({
      method: "GET",
      url: `/api/ao3/work/${ficID}`,
    }).then((result) => {
      setFicData(result.data);
      console.log(result.data);
    });
    setInputURL("");
  };

  /**
   * When the user clicks the clear button, will clear the form input field
   * @param {*} e event
   */
  const handleClear = (e) => {
    e.preventDefault();
    setInputURL("");
  };

  return (
    <div className="container">
      <div className="site-header" ref={headerRef}>
        <h1>Import a work:</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>URL: </label>
            <input
              required
              placeholder="AO3 url"
              value={inputURL}
              onChange={(e) => setInputURL(e.target.value)}
            />
          </div>
          <div className="button-group">
            <Button size="medium" type="submit" variant="contained">
              Submit
            </Button>
            <Button
              sx={{ marginLeft: "0.5em" }}
              variant="outlined"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </form>
      </div>
      <hr />
      <div className="pre-text">
        <div className="title-group">
          <h1 className="title">{ficData.title || ""}</h1>
          {ficData.author && <h2>by {ficData.author}</h2>}
        </div>
        {/* Accordion component containing statistics about the imported work */}
        {ficData.stats && <WorkStats ficData={ficData} />}
      </div>
      <br />
      {ficData && <hr />}
      <div className="text-body">
        {ficData &&
          ficData.chapters.map((x, i) => {
            return (
              <>
                <h2 id={i + 1} className={`chap-${i + 1}-header`}>
                  {x.chapter_title}
                </h2>
                {x.chapter_text.map((y, j) => {
                  return (
                    <p id={j + 1} className="chap-line">
                      {y}
                    </p>
                  );
                })}
              </>
            );
          })}
        <AppBar chapters={ficData.chapters} headerRef={headerRef} />
      </div>
    </div>
  );
}

export default App;
