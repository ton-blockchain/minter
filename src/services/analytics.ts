import ReactGA from "react-ga4";

export enum AnalyticsCategory {
  JETTON_PAGE = "Jetton page",
  DEPLOYER_PAGE = "Deployer page",
}

export enum AnalyticsAction {
  DEPLOY = "Deploy jetton",
}

const sendEvent = (category: AnalyticsCategory, action: AnalyticsAction, label: string) => {
  if(!ReactGA.isInitialized){
    return 
  }
  try {
    ReactGA.event({
      category,
      action,
      label,
    });
  } catch (error) {
    console.log(error);
  }
};

const init = () => {
 try {
  ReactGA.initialize(process.env.REACT_APP_GA!!);
  ReactGA.send(window.location.pathname + window.location.search);
 } catch (error) {
  
 }
};

const analytics = {
  sendEvent,
  init,
};

export default analytics;
