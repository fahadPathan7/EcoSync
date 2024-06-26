import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Avatar,
  AvatarBadge,
  Badge,
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [userData, setUserData] = useState({});
  const [roles, setRoles] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const profileImage = useRef(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/rbac/roles", {
          withCredentials: true,
        });
        setRoles(response.data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });
        if (response.data && response.data.user) {
          setUserData(response.data.user);
          if (response.data.user.profileImage) {
            setUserProfile(`http://localhost:3000/${response.data.user.profileImage}`);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
    fetchRoles();
  }, []);

  const mapRoleIdToRole = (roleId) => {
    const role = roles.find((r) => r.roleID === roleId);
    return role ? role.roleName : "Not Assigned";
  };

  const openChooseImage = () => {
    profileImage.current.click();
  };

  const changeProfileImage = (event) => {
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    const selected = event.target.files[0];

    if (selected && ALLOWED_TYPES.includes(selected.type)) {
      let reader = new FileReader();
      reader.onloadend = async () => {
        setUserProfile(reader.result);

        // Create a new FormData instance
        let formData = new FormData();
        // Add the file to the form data
        formData.append("profileImage", selected);

        // Send the form data to the backend
        try {
          await axios.put(`http://localhost:3000/profile/images`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          });
        } catch (error) {
          console.error("Error updating profile image:", error);
        }
      };
      reader.readAsDataURL(selected);
    } else {
      onOpen(); // Open the modal if file type is not allowed
    }
  };

  return (
    <VStack spacing={3} py={5} borderBottomWidth={1} borderColor="brand.light">
      <Avatar
        size="2xl"
        name={userData.name}
        cursor="pointer"
        onClick={openChooseImage}
        src={userProfile || "/img/tim-cook.jpg"}
      >
        <AvatarBadge bg="brand.blue" boxSize="1em">
          <svg width="0.4em" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
        </AvatarBadge>
      </Avatar>
      <input
        hidden
        type="file"
        ref={profileImage}
        onChange={changeProfileImage}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Something went wrong</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>File not supported!</Text>
            <HStack mt={1}>
              <Text color="brand.cadet" fontSize="sm">
                Supported types:
              </Text>
              <Badge colorScheme="green">PNG</Badge>
              <Badge colorScheme="green">JPG</Badge>
              <Badge colorScheme="green">JPEG</Badge>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack spacing={1}>
        <Heading as="h3" fontSize="xl" color="brand.dark">
          {userData.name || 'User Name'}
        </Heading>
        <Text color="brand.gray" fontSize="sm">
          {userData.roleIDs && userData.roleIDs.length > 0 ? (
            <ul>
              {userData.roleIDs.map((roleId, index) => (
                <li key={index}>{mapRoleIdToRole(roleId)}</li>
              ))}
            </ul>
          ) : 'Role Not Assigned'}
        </Text>
      </VStack>
    </VStack>
  );
}

export default Profile;
