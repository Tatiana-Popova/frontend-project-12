import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import {changeCurrentChannel} from '../../slices/channelSlice';
import getModal from '../../modals/index.js';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap'

const Channels = () => {
  const dispatch = useDispatch();
  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item })
  const renderModal = ({ modalInfo, hideModal }) => {
    if (!modalInfo.type) {
      return null;
    }
    const Component = getModal(modalInfo.type,);
    return <Component modalInfo={modalInfo} onHide={hideModal} />;
  };
  
  const channels = useSelector((state) => {
    return (Object.values(state.channels.entities))
  });

  return (
    <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Каналы</span>
        <button 
          className="p-0 text-primary btn btn-group-vertical"
          onClick={ () => showModal('addingChannel') }>
            +
          </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2">
        {channels.map((channel) => {
          if (channel.removable) {
            return (
              <li className="nav-item w-100">
                <Dropdown className="d-flex dropdown btn-group">
                  <Button className={cn('w-100', 'rounded-0', 'text-start', 'btn', 'text-truncate', {'btn-secondary': channel.isCurrent },  {'btn-light': !channel.isCurrent})} onClick={(e) => dispatch(changeCurrentChannel({reason: 'changing', channelIdToChange: channel.id}))}>
                    <span className="me-1">#</span>
                      {channel.name}
                    </Button>
                  <Dropdown.Toggle split className={cn({'btn-secondary': channel.isCurrent}, {'btn-light': !channel.isCurrent})}/>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={ () => showModal('removingChannel', channel) } eventKey="1">Удалить</Dropdown.Item>
                    <Dropdown.Item onClick={ () => showModal('renamingChannel', channel) } eventKey="2">Переименовать</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            )
          } else {
              return (
                <li className="nav-item w-100">
                  <button type="button" 
                    className={cn('w-100', 'rounded-0', 'text-start', 'btn', 'text-truncate', {'btn-secondary': channel.isCurrent })}
                    onClick={(e) => dispatch(changeCurrentChannel({reason: 'changing', channelIdToChange: channel.id}))}
                    >
                    <span className="me-1">#</span>
                    {channel.name}
                  </button>
                </li>
              )
            }
      })}
      </ul>
      { renderModal({ modalInfo, hideModal })} 
    </div>
  )
};

export default Channels