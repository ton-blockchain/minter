import ReactGA from "react-ga";


export enum AnalyticsCategory {
  JETTON_PAGE = "Jetton page",
  DEPLOYER_PAGE = "Deployer page",
}

export enum AnalyticsAction {
  DEPLOY = "Deploy jetton",
}

const sendEvent = (
  category: AnalyticsCategory,
  action: AnalyticsAction,
  label: string
) => {
  try {
    ReactGA.event({
        category,
        action,
        label,
      })
  } catch (error) {
    console.log(error);
    
  }
};


const init = () => {  
  ReactGA.initialize(process.env.REACT_APP_GA!!)
  ReactGA.pageview(window.location.pathname + window.location.search);

}

const analytics = {
  sendEvent,
  init
};

export default analytics;
