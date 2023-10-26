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
      <IconButton
        size="large"
        sx={{
          color: "white",
          backgroundColor: "error.main",
          ":hover": { backgroundColor: "error.main", opacity: 0.9 },
          position: "fixed",
          right: 50,
          bottom: 50,
        }}
        onClick={() => router.push("/AddMilestone")}
      >
        <AddOutlined sx={{ fontSize: 30 }} />
      </IconButton>
    </HomeLayout>
  );
};

export default HomePage;
