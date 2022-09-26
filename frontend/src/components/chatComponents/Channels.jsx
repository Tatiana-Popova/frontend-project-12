import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

const Channels = () => {
  const channels = useSelector((state) => {
    return (Object.values(state.channels.entities))
  });
  console.log('rendering channels');
  return (
    <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Каналы</span>
        <button className="p-0 text-primary btn btn-group-vertical">+</button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2">
        {channels.map((channel) => {
        return  (
          <li className="nav-item w-100">
            <button type="button" className="w-100 rounded-0 text-start btn">
              <span className="me-1">#</span>
              {channel.name}
            </button>
          </li>
        )
      })}
      </ul>
    </div>
  )
};

export default Channels