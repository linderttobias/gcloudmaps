import React, { useEffect, useState, useCallback, useRef } from 'react';
import './index.css';


const Home = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "scroll");
    });

    return (
            <div>
            <div className="container">
                <div className="component">
                    gcloud maps<sup class="superscript">by Tobias Lindert</sup>
                </div>
               <div className="about">
                    <a class="info-button" href="/">Go back</a>
               </div>
            </div>
        
        <div className="info-content">
                <div className="info-text">
                  <h3> About Gcloudmaps:</h3>
                  <p>more info coming soon ..
                  </p>
                  <h3> About Me:</h3>
                  <p>Hey there! I'm a Cloud Data Engineer with a passion for tackling complex challenges through the power of cloud technologies. In the rare event of a global network apocalypse, you'll catch me shredding up fresh powder in the Alps, kitesurfing across my local lake, or whipping up a scrumptious eggplant lasagna for my friends to enjoy as we ride out the digital storm.
                  </p>
                </div>
                <div className="info-image">
                  <h3>Architecture:</h3>
                  <img src="images/architecture.svg" alt="info image" />
                </div>
        </div>
        </div>
            );
}


export default () => (
      <Home/>
  );