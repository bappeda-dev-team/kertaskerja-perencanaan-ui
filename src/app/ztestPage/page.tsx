// components/ExactRiskTable.js
import React from 'react';

const ExactRiskTable = () => {
  return (
    <table className="w-full border-collapse font-sans text-left">
      <thead>
        <tr>
          <th rowSpan={2} className="border border-black p-2 align-top">No</th>
          <th rowSpan={2} className="border border-black p-2 align-top">Pelaksana</th>
          <th rowSpan={2} className="border border-black p-2 align-top">Pemilik Resiko</th>
          <th colSpan={2} className="border border-black p-2 bg-gray-100 font-bold">Pohon Kinerja</th>
          <th rowSpan={2} className="border border-black p-2 align-top">Pagu</th>
        </tr>
        <tr>
          <th className="border border-black p-2 bg-gray-100 font-bold">Pohon Kinerja Atasan</th>
          <th className="border border-black p-2 bg-gray-100 font-bold">Pohon Kinerja Pelaksana</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-black p-2 align-top">1</td>
          <td className="border border-black p-2 align-top">Nama Level 4</td>
          <td className="border border-black p-2 align-top">Nama Level 3</td>
          <td className="border border-black p-2 align-top"></td>
          <td className="border border-black p-2 align-top"></td>
          <td className="border border-black p-2 align-top">Pagu Anggaran</td>
        </tr>
      </tbody>
    </table>
  );
};

export default ExactRiskTable;