import AddChannel from './AddChannel.jsx';
import RemoveChannel from './RemoveChannel.jsx';
import RenameChannel from './RenameChannel.jsx';

const modals = {
  addingChannel: AddChannel,
  removingChannel: RemoveChannel,
  renamingChannel: RenameChannel
};

const getModal = (modalName) => modals[modalName];
export default getModal;
