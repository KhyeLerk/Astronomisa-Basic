import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import DataViewer from './pages/dataViewer';
import ResultViewer from './pages/resultViewer';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/Astronomisa-Basic/DataViewer" component={DataViewer} exact={true} />
          <Route path="/Astronomisa-Basic/ResultViewer" component={ResultViewer} exact={true} />
          <Route path="/Astronomisa-Basic" render={() => <Redirect to="/Astronomisa-Basic/DataViewer" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="top">
          <IonTabButton tab="DataViewer" href="/Astronomisa-Basic/DataViewer"> 
            <IonLabel>Data Viewer</IonLabel>
          </IonTabButton>
          <IonTabButton tab="ResultViewer" href="/Astronomisa-Basic/ResultViewer">
            <IonLabel>Result Viewer</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
