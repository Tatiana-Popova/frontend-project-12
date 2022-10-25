import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import {changeCurrentChannel} from '../../slices/channelSlice';
import getModal from '../../modals/index.js';
import { Dropdown, Button, Col, Nav } from 'react-bootstrap'
import useAuth from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";
import { toast } from "react-toastify";

const Channels = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const channelState = useSelector((state) => state.channels);
  const channelStateErrorCode = channelState.error?.code;

  useEffect(() => {
    if (channelStateErrorCode === 'ERR_BAD_REQUEST') {
      auth.logOut();
      navigate('/login');
    } else if (channelStateErrorCode) {
      toast.error(t('errors.networkError'));
    }
  }, [channelStateErrorCode]);

 
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
    <Col className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Каналы</span>
        <Button 
          className="p-0 text-primary btn btn-group-vertical btn-light"
          onClick={ () => showModal('addingChannel') }>
          +
        </Button>
      </div>
      <Nav className="flex-column nav-pills nav-fill px-2">
        {channels.map((channel) => {
          if (channel.removable) {
            return (
              <Nav.Item className="nav-item w-100">
                <Dropdown className="d-flex dropdown btn-group">
                  <Button 
                    className={cn('w-100', 'rounded-0', 'text-start', {'btn-secondary': channel.isCurrent },  {'btn-light': !channel.isCurrent})} 
                    onClick={(e) => dispatch(changeCurrentChannel({reason: 'changing', channelIdToChange: channel.id}))}>
                    <span className="me-1">#</span>
                      {channel.name}
                    </Button>
                  <Dropdown.Toggle split className={cn({'btn-secondary': channel.isCurrent}, {'btn-light': !channel.isCurrent})}/>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={ () => showModal('removingChannel', channel) } eventKey="1">{t('delete')}</Dropdown.Item>
                    <Dropdown.Item onClick={ () => showModal('renamingChannel', channel) } eventKey="2">{t('rename')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>
            )
          } else {
              return (
                <Nav.Item className="nav-item w-100">
                  <Button type="button" 
                    className={cn('w-100', 'rounded-0', 'text-start', {'btn-secondary': channel.isCurrent },  {'btn-light': !channel.isCurrent})}
                    onClick={(e) => dispatch(changeCurrentChannel({reason: 'changing', channelIdToChange: channel.id}))}
                    >
                    <span className="me-1">#</span>
                    {channel.name}
                  </Button>
                </Nav.Item>
              )
            }
        })}
      </Nav>
      { renderModal({ modalInfo, hideModal })} 
    </Col>
  )
};

export default Channels