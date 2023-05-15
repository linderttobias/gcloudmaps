import React, { useEffect, useState, useCallback, useRef } from 'react';
import './index.css';

const Home = () => {

    return (
            <div>
            <div className="container">
                <div className="component">
                    gcloud maps<sup class="superscript">by Tobias Lindert</sup>
                </div>
               <div className="back">
                    <a class="info-button" href="/">Go back</a>
               </div>
            </div>
        
        <div className="info-content">
                <div className="info-image">
                <div>
                <h3>About the project:</h3>
                Embarking on my journey as Cloud Enginer to empower the Google Cloud, I started using Excalidraw to document my learning process through diagrams and notes. Realizing the potential benefit for others, I transformed my personal sketches into an accessible, collaborative project that serves as a visual guide for Google Cloud learners. This page is about Google Cloud and created with Google Cloud. The Frontend has been created with React (React-Flow) and NodeJS.

Committed to keeping the content up-to-date, I regularly update the project with new information and insights on Google Cloud technologies. I also plan to Open Source the Project as an ready to deploy example for interested people.
                </div>
                  <h3>Architecture:</h3>
                  <img
      src="images/architecture.svg"
    />
                </div>
                <div className="info-text">
                <h3> About Me:</h3>
                  <p>Hey there! I'm a Cloud Data Engineer with a passion for tackling complex challenges through the power of cloud technologies. In the rare event of a global network apocalypse, you'll catch me shredding up fresh powder in the Alps, kitesurfing across my local lake, or whipping up a scrumptious eggplant lasagna for my friends to enjoy as we ride out the digital storm.
                  </p>
                <h3>Contact:</h3>
                  email: linderttobias@gmail.com <br/>
                  location: Munich\Chiemsee
                </div>
        </div>
        </div>
            );
}


export default () => (
      <Home/>
  );