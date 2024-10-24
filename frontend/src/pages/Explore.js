import NewMembers from '../components/NewMembers';

const Explore = ({ userId }) => {
  return (
    <div>
      <NewMembers userId={userId} />
      {/* Other sections for explore page */}
    </div>
  );
};

export default Explore;
