import { Group, Button, Text, Box, Menu, Avatar } from "@mantine/core";
import classes from "./Navbar.module.css";
import { supabaseClient } from "../config/supabaseConfig";
import { Form, Link, useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { IconExternalLink } from "@tabler/icons-react";
import userStore from "../store/userStore";

export default function Navbar() {
  const navigate = useNavigate();

  const { userSettings } = userStore();
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
            {userSettings && userSettings?.slug && (
              <a
                href={`http://localhost:3000/${userSettings.slug}`}
                rel={"noreferrer"}
                target="_blank"
                className="text-blue-900"
              >
                <IconExternalLink stroke={2} />
              </a>
            )}

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <button className="flex gap-2 justify-center items-center">
                  <Avatar src={null} alt="no image here" color="#172656" />
                </button>
              </Menu.Target>
              <Menu.Dropdown>
                <button
                  type="button"
                  style={{ width: "100%" }}
                  onClick={async () => {
                    await supabaseClient.auth.signOut();
                    showToast("You have been logged out", "success");
                    navigate("/login");
                  }}
                >
                  <Menu.Item>Log Out</Menu.Item>
                </button>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </header>
    </Box>
  );
}
