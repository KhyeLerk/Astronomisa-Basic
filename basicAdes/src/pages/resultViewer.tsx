import React, { useState } from 'react';
import { IonContent, IonInput, IonButton, IonPage } from '@ionic/react';
import './resultViewer.css';
import axios from 'axios';
import TableRow from '../components/resultViewer';
import TableRowM from '../components/resultViewerMobile';
import MediaQuery from 'react-responsive';
import { setupCache } from 'axios-cache-adapter';

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000
})

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
  adapter: cache.adapter
})

var ResArr: string[] = new Array();
var APIArr: string[] = new Array();

var i = 0;


const getBasicResultsCache = (festivalId: number) => {
  //get table data per page
  for (var j = 0; j < ResArr.length; j++) {
    console.log("hi")
    console.log(APIArr[j]);

    console.log(APIArr[j].includes(festivalId.toString()));
    if (APIArr[j].includes(festivalId.toString())) {
      console.log("exists")
      console.log(JSON.parse(ResArr[j]));
      var json = JSON.parse(ResArr[j])
    
      return api.get(
        ``
      ).then(async (response) => {
        return json
      }).catch(error => {
        return json;
      });
    }
  }

  console.log("new api")
  return api.get(
    `https://jibaboom-astronomia.herokuapp.com/basic/result?festivalId=${festivalId}`
  ).then(async (response) => {
    // Do something fantastic with response.data \o/
    console.log('Request response:', response.data.result)
    ResArr[i] = JSON.stringify(response.data.result);
    APIArr[i] = `https://jibaboom-astronomia.herokuapp.com/basic/result?festivalId=${festivalId}`
    console.log(JSON.parse(ResArr[i]))
    i++
    if(i === 3){ i = 0}
    return response.data.result
  }).catch(error => {
    console.log("error");
    alert(error);
    return [{ "performanceId": "festivalId not found!" }];
  });

};


const ResultViewer: React.FC = () => {


  const [festivalId, setFestivalId] = useState<number>(0);
  const [festivalIdStr, setFestivalIdStr] = useState<String>("");

  const [dataRow, setDataRow] = React.useState([]);
  const [pressed, setPressed] = useState<number>(0);
  var timeArr = new Array();
  var timeArrM = new Array();

  var i = 0;
  var j = 0;
  var k = -1;

  function festivalIdString(fes: number) {
    setFestivalIdStr(fes.toString())

  }

  function getResults(festivalId: number) {
    getBasicResultsCache(festivalId).then((data: any) => { setDataRow(data) })
    setPressed(1);
    festivalIdString(festivalId);
  }

  function hide() {
    if (pressed === 1 && dataRow.length !== 0) {
      return "hidden"
    }
    else return ""

  }

  function hide1() {
    if (pressed === 1 && dataRow.length !== 0) {
      return ""
    }
    else return "hidden"

  }


  return (
    <IonPage>
      <IonContent>
        <div id="center" className={hide()}>
          <h1 id="mainText">Enter festivalId Below</h1>
          <IonInput id="mainInput" type="number" min="0" value={festivalId} placeholder="Enter festivalId" onIonChange={e => { setFestivalId(parseInt(e.detail.value!, 10)) }} />
          <IonButton onClick={() => { getResults(festivalId) }} id="searchRV">Search </IonButton>
        </div>
        <div id="afterSearch" className={hide1()}>
          <MediaQuery minDeviceWidth={600}>
            <h1 id="leftMain">festivalId : {festivalIdStr}</h1>
            <IonInput id="rightInput" type="number" min="0" value={festivalId} placeholder="Enter festivalId" onIonChange={e => { setFestivalId(parseInt(e.detail.value!, 10)) }} />
            <IonButton onClick={() => { getResults(festivalId) }} id="searchRight">Search </IonButton>
          </MediaQuery>

          <MediaQuery maxDeviceWidth={600}>
            <IonInput id="rightInput" type="number" min="0" value={festivalId} placeholder="Enter festivalId" onIonChange={e => { setFestivalId(parseInt(e.detail.value!, 10)) }} />
            <IonButton onClick={() => { getResults(festivalId) }} id="searchRight">Search </IonButton>
            <h1 id="leftMain">festivalId : {festivalIdStr}</h1>
          </MediaQuery>


        </div>

        <MediaQuery minDeviceWidth={600}>


          <table className="W">
            {dataRow.map(item => {
              timeArr[j] = [<td key={item['startTime']}>{item['startTime']}-{item['endTime']}</td>]
              timeArrM[j] = [<td key={item['startTime']}><p>{item['startTime']}</p><p>{item['endTime']}</p></td>]

              j++
              return true;
            })
            }

            <p className={pressed === 1 && dataRow.length === 0 ? "red" : "HideRow1 red"}>FestivalId not Found!</p>

            <tbody>
              <tr>
                <td className={pressed === 1 && dataRow.length !== 0 ? "ShowRow" : "HideRow"}></td>
                {
                  timeArr
                }
              </tr>

              {dataRow.map(item => {
                i++
                return (
                  <TableRow key={item['performanceId']} i={i} performanceId={item['performanceId']} timeArr={timeArr} />

                );
              })}
            </tbody>
          </table>

        </MediaQuery>

        <MediaQuery maxDeviceWidth={600}>
          <table className='M'>
            <tbody>
              <p className={pressed === 1 && dataRow.length === 0 ? "red" : "HideRow1 red"}>FestivalId not Found!</p>

              <tr>
                <td className={pressed === 1 && dataRow.length !== 0 ? "ShowRow M" : "HideRow"}>

                  <p>Time</p>
                </td>
                <td className={pressed === 1 && dataRow.length !== 0 ? "ShowRow M" : "HideRow"}>
                  <p>performanceId</p>
                </td>
              </tr>

              {dataRow.map(item => {
                k++
                return (
                  <TableRowM key={item['performanceId']} i={k} performanceId={item['performanceId']} timeArr={timeArrM} />

                );
              })}
            </tbody>
          </table>
        </MediaQuery>
      </IonContent>
    </IonPage>
  );
};

export default ResultViewer;
