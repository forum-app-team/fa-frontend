import { Button } from "react-bootstrap";

const EditProfileButton = ({ onClick }) => {
  return (
    <Button variant="primary" onClick={onClick}>
      Edit Profile
    </Button>
  );
};

export default EditProfileButton;
