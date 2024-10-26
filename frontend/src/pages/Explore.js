import NewMembers from '../components/NewMembers';
import ActiveMembers from '../components/ActiveMembers';
import CloseMembers from '../components/CloseMembers';

const Explore = ({ userId }) => {
  return (
    <div>
      <NewMembers userId={userId} />
      <CloseMembers userId={userId} />
      <ActiveMembers userId={userId} />
    </div>
  );
};

export default Explore;
