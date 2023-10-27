import { IconButton, useMediaQuery } from "@mui/material";
import { AddOutlined, Image, MailOutlined } from "@mui/icons-material";
import { HomeLayout } from "../../layout";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import Welcome from "../../components/Welcome/Welcome";

const HomePage = () => {
  const { user, logout } = useAuth();

  const router = useRouter();
  user ? console.log("USER    :", user) : console.log("Not logged in");

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  const isMediumScreen = useMediaQuery("(min-width: 600px)");
  return (
    <HomeLayout>
      <Welcome />
      {/* <TrazabilityContent /> */}
     
    </HomeLayout>
  );
};

export default HomePage;
