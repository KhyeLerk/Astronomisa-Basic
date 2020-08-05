import React, { useState } from 'react';
import { IonContent,IonItem, IonButton,IonSelect,IonSelectOption, IonLabel, IonInput, IonFooter, IonPage, IonToolbar } from '@ionic/react';
import TableRow from '../components/dataViewerContent';
import './dataViewer.css';
import axios from 'axios';
import MediaQuery from 'react-responsive';

const getDataTable = (pages: number, rows: number) => {
  //get table data per page
  return axios.get('https://jibaboom-astronomia.herokuapp.com/basic/data', {
    params: {
        page:  pages,
        rows: rows
    }}).then(response => {
      console.log(response.data)
    return response.data;
  }).catch(error => {
    console.log("error");
    alert(error);
  });
};

 
const getDataTableFiltered = (pages: number, festivalId: number, startTime: number, rows: number) => {
  //get filtered table data per page 
  return axios.get(`https://jibaboom-astronomia.herokuapp.com/basic/filter`, {
    params: {
        page:  pages,
        rows: rows,
        startTime: startTime,
        festivalId: festivalId
    }}).then(response => {
    if (response.data.length !== 0){
    console.log(response.data)
      return response.data;
    }
    else {
      return [{ "performanceId": "NO RESULTS FOUND", "festivalId": "NO RESULTS FOUND", "startTime": "NO RESULTS FOUND", "endTime": "NO RESULTS FOUND" }];
    }
  }).catch(error => {
    console.log("error");
    alert(error);
  });
};
const getAllFilteredRows = (startTime: number, festivalId: number) => {
  //get filtered table data per page 
  return axios.get('https://jibaboom-astronomia.herokuapp.com/basic/count',{
    params: {
      startTime:  startTime,
      festivalId: festivalId
  }}).then(response => {
    console.log(response.data[0].count)
    return response.data[0].count;
  }).catch(error => {
    console.log("error");
    alert(error);
  });
};


const getAllData = () => {
  //get number of data
  return axios.get('https://jibaboom-astronomia.herokuapp.com/basic/data',{
    params: {
      page:  1,
      rows: 999999
  }}).then(response => {
    console.log(response.data.length)
  return response.data.length; 

  }).catch(error => {
    console.log("error");
    alert(error);
  });
};

const DataViewer: React.FC = () => {

  //------Data binding-------//
  //Setting for input filter
  const [festivalId, setFestivalId] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [festivalIdNum, setFestivalIdNum] = useState<number>(0);
  const [startTimeNum, setStartTimeNum] = useState<number>(0);
  //setting for rows to be displayed 
  const [dataRow, setDataRow] = React.useState([]);
  //setting for total count of returned rows
  const [totalData, setTotalData] = React.useState<number>();
  const [totalDataFiltered, setTotalDataFiltered] = React.useState<number>();
  //setting for pagination
  var [pageSize, setPageSize] = React.useState<number>(10);
  var [pageSizeString, setPageSizeString] = React.useState<String>("10");
  const [currentPage, setCurrentPage] = useState<number>(1);
  var [startPage, setStartPage] = React.useState<number>(0);
  var [endPage, setEndPage] = React.useState<number>(5);

  //Setting total pages to variables
  const totalPages = Math.ceil(totalData! / pageSize);
  const totalPagesFiltered = Math.ceil(totalDataFiltered! / pageSize);
  //Checks if search is pressed
  const [pressed, setPressed] = useState<number>(0);
  //Variable for table CSS
  var tableRow = 0;

  //gets filtered response data then stores in dataRow array 
  function showFilteredRows() {
    if (festivalId.length !== 0 || startTime.length !== 0) {
      setCurrentPage(1);
      getDataTableFiltered(1, festivalIdNum, startTimeNum, pageSize).then(data => { setDataRow(data) })
      getAllFilteredRows(startTimeNum, festivalIdNum).then(data => setTotalDataFiltered(data));
      setPressed(1);
    }
  }

  //Validation checks for changes in useState for filter input and page size
  React.useEffect(() => {
    if (Number.isNaN(startTimeNum)) {
      setStartTimeNum(0);
    }
    if (Number.isNaN(festivalIdNum)) {
      setFestivalIdNum(0);
    }
    if (festivalIdNum === 0 && startTimeNum === 0) {
      getDataTable(currentPage, pageSize).then(data => setDataRow(data));
      setPressed(0);
    }
    if (Number.isNaN(pageSize)) {
      setPageSize(10);
    }
    //gets total count of response data then stores in dataRow array
   getAllData().then(data => setTotalData(data));
    if (pageSize === totalDataFiltered)
      changePage(currentPage - 1, pageSize)
      
    // eslint-disable-next-line
  }, [startTimeNum, festivalIdNum, pageSize, pressed, currentPage]);


  //change page function
  function changePage(pageNo: number, pageSize: number) {
    var pages = 0;
    if (pressed === 0) {
      pages = totalPages
    } else {
      pages = totalPagesFiltered
    }

    if (!(pageNo > pages) && !(pageNo < 1)) {
      if (festivalIdNum === 0 && startTimeNum === 0) {
        getDataTable(pageNo, pageSize).then(data => setDataRow(data))
        setCurrentPage(pageNo);
      }
      else {
        getDataTableFiltered(pageNo, festivalIdNum, startTimeNum, pageSize).then(data => { setDataRow(data) })
        setCurrentPage(pageNo);
      }

    }


  }


  //function to dynamically create pagination buttons based on response data length
  function getPagination() {
    let arrayOfPages: number[] = []
    var i = 1;


    if (pressed === 0) {
      for (i; i <= totalPages; i++) {
        arrayOfPages.push(i)
      }
    } else {
      for (i; i <= totalPagesFiltered; i++) {
        arrayOfPages.push(i)
      }
    }

    if(currentPage >= endPage-1){
      setStartPage(++startPage);
      setEndPage(++endPage);
    }

    if((currentPage-1 <= startPage) && !(currentPage < 3)){
      setStartPage(--startPage);
      setEndPage(--endPage);
    }else if(currentPage < 3 && startPage !== 0){
      setStartPage(--startPage);
      setEndPage(--endPage);
    }

    let arrayOfPages1: number[] = arrayOfPages.slice(startPage,endPage);


    return (
      arrayOfPages1.map((pageNo: number) => (
        <button key={pageNo} onClick={() => changePage(pageNo, pageSize)} className={(currentPage === pageNo) ? 'active' : 'notActive'}>{pageNo}</button>
      )
      )
    )
  }

  //Returns the total count of displayed data
  function getAllEntries() {
    if (pressed === 0) {
      return totalData
    }
    else {
      return totalDataFiltered
    }
  }
  //Get current entry in data table
  function getCurrentEntries() {
    var noOfEntries = dataRow.length;

    var startingEntry = currentPage;

    if (startingEntry! > 9) {
      startingEntry = startingEntry! * pageSize + 1
    } else {
      startingEntry = (startingEntry! - 1) * pageSize + 1;
    }
    var endingEntry = startingEntry! + noOfEntries - 1;
    return startingEntry + "-" + endingEntry;
  }

  const customPopoverOptions = {
    header: 'Page Size',
  };

  return (
    <IonPage>
      <IonContent>
        <IonToolbar id="filter">
          <IonInput type="number" min="0" value={festivalId} placeholder="Filter festivalId" onIonChange={e => { setFestivalId(e.detail.value!); setFestivalIdNum(parseInt(e.detail.value!, 10));}} className="input"></IonInput>
          <IonInput type="number" min="0" value={startTime} placeholder="Filter startTime" onIonChange={e => { setStartTime(e.detail.value!); setStartTimeNum(parseInt(e.detail.value!, 10)); }} className="input"></IonInput>
          
          <MediaQuery maxDeviceWidth={600}> 
          <IonItem id="mobilePageSize">
          <IonLabel>Page Size</IonLabel>

            <IonSelect interfaceOptions={customPopoverOptions} value={pageSizeString} okText="Select" cancelText="Dismiss" onIonChange={e => { setPageSizeString(e.detail.value!);setPageSize(parseInt(e.detail.value!, 10)) }}>
              <IonSelectOption value="5">5</IonSelectOption>
              <IonSelectOption value="10">10</IonSelectOption>
              <IonSelectOption value="15">15</IonSelectOption>
              <IonSelectOption value="20">20</IonSelectOption>
              <IonSelectOption value="25">25</IonSelectOption>
              <IonSelectOption value="50">50</IonSelectOption>
              <IonSelectOption value="100">100</IonSelectOption>
            </IonSelect>
            </IonItem>
          </MediaQuery>

          <IonButton onClick={() => { showFilteredRows() }} id="search">Search </IonButton>

        </IonToolbar>


        <div id="table">
          <table id="row" color="dark">
            <thead>
              <tr>
                <th>festivalId</th>
                <th>performanceId</th>
                <th>startTime</th>
                <th>endTime</th>
              </tr>
            </thead>
            <tbody>
              {dataRow.map(item => {
                  tableRow++;
                return (
                  <TableRow key={item['performanceId']} festivalId={item['festivalId']} performanceId={item['performanceId']} startTime={item['startTime']} endTime={item['endTime']} className={(tableRow%2 ===  1) ?  'GrayColor' : 'WhiteColor'}/>
               );
              })
              }
            </tbody>
          </table>
        </div>
      </IonContent>
      <IonFooter >
        <IonToolbar>
          <IonLabel id="tableSize">Showing {getCurrentEntries()} of {getAllEntries()} entries</IonLabel>
          <div className="pagination">
            <button onClick={() => changePage(1, pageSize)}>&laquo;&laquo;</button>
            <button onClick={() => changePage(currentPage - 1, pageSize)}>&laquo;</button>
            {getPagination()}
            <button onClick={() => changePage(currentPage + 1, pageSize)}>&raquo;</button>
            {pressed === 1 ?
              <button onClick={() => changePage(totalPagesFiltered, pageSize)}>&raquo;&raquo;</button>
              :
              <button onClick={() => changePage(totalPages, pageSize)}>&raquo;&raquo;</button>
            }

          </div>
          <MediaQuery minDeviceWidth={601}>
          <IonInput onKeyDown={(e) => { e.preventDefault(); }} type="number" min="1" value={pageSize} onIonChange={e => { setPageSize(parseInt(e.detail.value!, 10)) }} id="pageSize"></IonInput>
          </MediaQuery>
        </IonToolbar>
      </IonFooter>
    </IonPage >
  );
};

export default DataViewer;
