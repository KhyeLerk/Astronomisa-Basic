import React from 'react';
import './dataViewerContent.css';

interface ContainerProps {
  performanceId: string;
  i: number;
  timeArr: string[];
}


const TableRow: React.FC<ContainerProps> = ({ performanceId, i, timeArr }) => {
  return (
    <tr>

      {timeArr[i]}

      <td key={performanceId}><p id="mPer">{performanceId}</p></td>

    </tr>
  );
};

export default TableRow;
