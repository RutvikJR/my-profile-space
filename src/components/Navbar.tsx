import { Group, Button, Text, Box } from "@mantine/core";
import classes from "./Navbar.module.css";
import { supabaseClient } from "../config/supabaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <Box py={20}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link to={"/"}>
            <Text fw={"bold"} className="text-3xl text-cyan-600">
              My Profile Space
            </Text>
          </Link>

          <Group visibleFrom="sm">
            <Button
              color="red"
              variant="outline"
              onClick={async () => {
                await supabaseClient.auth.signOut();
                showToast("You have been logged out", "success");
                navigate("/login");
              }}
            >
              Log out
            </Button>
          </Group>
        </Group>
      </header>
    </Box>
  );
}
