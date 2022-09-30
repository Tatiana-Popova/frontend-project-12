import React from "react";
import { useSelector } from 'react-redux';
import cn from 'classnames';

const Channels = () => {
  const channels = useSelector((state) => {
    return (Object.values(state.channels.entities))
  });
  return (
    <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Каналы</span>
        <button className="p-0 text-primary btn btn-group-vertical">+</button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2">
        {channels.map((channel) => {
          const btnClass = cn('w-100', 'rounded-0', 'text-start', 'btn', {'btn-secondary': channel.isCurrent });
        return (
          <li className="nav-item w-100">
            <button type="button" className={btnClass}>
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