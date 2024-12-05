import { useState, useEffect, ReactNode, useContext, lazy, Suspense } from "react";
import {
  AddButton,
  GreetingHeader,
  GreetingText,
  Offline,
  TasksCountContainer,
} from "../styles";

import { getRandomGreeting } from "../utils";
import { Emoji } from "emoji-picker-react";
import { Tooltip  } from "@mui/material";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { AddRounded, WifiOff } from "@mui/icons-material";
import { UserContext } from "../contexts/UserContext";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { useNavigate } from "react-router-dom";
import { TaskProvider } from "../contexts/TaskProvider";

const TasksList = lazy(() =>
  import("../components/tasks/TasksList").then((module) => ({ default: module.TasksList })),
);

const Home = () => {
  const { user } = useContext(UserContext);
  const { tasks, emojisStyle, settings, name } = user;
  const [randomGreeting, setRandomGreeting] = useState<string | ReactNode>("");
  const [greetingKey, setGreetingKey] = useState<number>(0);
 


  const isOnline = useOnlineStatus();
  const n = useNavigate();
  const isMobile = useResponsiveDisplay();

  useEffect(() => {
    setRandomGreeting(getRandomGreeting());
    document.title = "Contactos - Home";

    const interval = setInterval(() => {
      setRandomGreeting(getRandomGreeting());
      setGreetingKey((prevKey) => prevKey + 1); // Update the key on each interval
    }, 6000);

    return () => clearInterval(interval);
  }, []);

 

  const replaceEmojiCodes = (text: string): ReactNode[] => {
    const emojiRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(emojiRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // It's an emoji code, render Emoji component
        const emojiCode = part.trim();
        return <Emoji key={index} size={20} unified={emojiCode} emojiStyle={emojisStyle} />;
      } else {
        // It's regular text
        return part;
      }
    });
  };

  const renderGreetingWithEmojis = (text: string | ReactNode) => {
    if (typeof text === "string") {
      return replaceEmojiCodes(text);
    } else {
      // It's already a ReactNode, no need to process
      return text;
    }
  };

  // Returns a greeting based on the current time.
  const displayGreeting = (): string => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let greeting: string;
    if (currentHour < 12 && currentHour >= 5) {
      greeting = "Buenos días";
    } else if (currentHour < 18 && currentHour > 12) {
      greeting = "Buenas tardes";
    } else {
      greeting = "Buenas noches";
    }

    return greeting;
  };

  // Returns a task completion message based on the completion percentage.
  // const getTaskCompletionText = (completionPercentage: number): string => {
  //   switch (true) {
  //     case completionPercentage === 0:
  //       return "No tasks completed yet. Keep going!";
  //     case completionPercentage === 100:
  //       return "Congratulations! All tasks completed!";
  //     case completionPercentage >= 75:
  //       return "Almost there!";
  //     case completionPercentage >= 50:
  //       return "You're halfway there! Keep it up!";
  //     case completionPercentage >= 25:
  //       return "You're making good progress.";
  //     default:
  //       return "You're just getting started.";
  //   }
  // };

  return (
    <>
      <GreetingHeader>
        <Emoji unified="1f44b" emojiStyle={emojisStyle} /> &nbsp; {displayGreeting()}
        {name && (
          <span translate="no">
            , <span>{name}</span>
          </span>
        )}
      </GreetingHeader>
      <GreetingText key={greetingKey}>{renderGreetingWithEmojis(randomGreeting)}</GreetingText>
      {!isOnline && (
        <Offline>
          <WifiOff /> Estás desconectado pero puedes usar la aplicación!
        </Offline>
      )}
      {tasks.length > 0 && (
        <TasksCountContainer>
          {/* <TasksCount glow={settings.enableGlow}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <StyledProgress
                variant="determinate"
                value={completedTaskPercentage}
                size={64}
                thickness={5}
                aria-label="Progress"
                glow={settings.enableGlow}
              />

              <ProgressPercentageContainer
                glow={settings.enableGlow && completedTaskPercentage > 0}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="white"
                  sx={{ fontSize: "16px", fontWeight: 600 }}
                >{`${Math.round(completedTaskPercentage)}%`}</Typography>
              </ProgressPercentageContainer>
            </Box>
            <TaskCountTextContainer>
              <TaskCountHeader>
                {completedTasksCount === 0
                  ? `You have ${tasks.length} task${tasks.length > 1 ? "s" : ""} to complete.`
                  : `You've completed ${completedTasksCount} out of ${tasks.length} tasks.`}
              </TaskCountHeader>
              <TaskCompletionText>
                {getTaskCompletionText(completedTaskPercentage)}
              </TaskCompletionText>
              {tasksWithDeadlineTodayCount > 0 && (
                <span
                  style={{
                    opacity: 0.8,
                    display: "inline-block",
                  }}
                >
                  <TodayRounded sx={{ fontSize: "20px", verticalAlign: "middle" }} />
                  &nbsp;Tasks due today:&nbsp;
                  <span translate="no">
                    {new Intl.ListFormat("en", { style: "long" }).format(tasksDueTodayNames)}
                  </span>
                </span>
              )}
            </TaskCountTextContainer>
          </TasksCount> */}
        </TasksCountContainer>
      )}
      <Suspense fallback={<div>Cargando...</div>}>
        <TaskProvider>
          <TasksList />
        </TaskProvider>
      </Suspense>
      {!isMobile && (
        <Tooltip title={tasks.length > 0 ? "Contacto Nuevo" : "Agregar Contacto"} placement="left">
          <AddButton
            animate={tasks.length === 0}
            glow={settings.enableGlow}
            onClick={() => n("add")}
            aria-label="Agregar Contacto"
          >
            <AddRounded style={{ fontSize: "44px" }} />
          </AddButton>
        </Tooltip>
      )}
    </>
  );
};

export default Home;
