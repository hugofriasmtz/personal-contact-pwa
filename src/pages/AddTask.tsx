import { Category, Task } from "../types/user";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AddTaskButton, Container, StyledInput } from "../styles";
import { AddTaskRounded } from "@mui/icons-material";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH, TASK_PHONE_MAX_LENGTH } from "../constants";
import { CategorySelect, ColorPicker, TopBar, CustomEmojiPicker } from "../components";
import { UserContext } from "../contexts/UserContext";
import { useStorageState } from "../hooks/useStorageState";
import { useTheme } from "@emotion/react";
import { generateUUID, getFontColor, showToast } from "../utils";
import { ColorPalette } from "../theme/themeConfig";
import InputThemeProvider from "../contexts/InputThemeProvider";

const AddTask = () => {
  const { user, setUser } = useContext(UserContext);
  const theme = useTheme();
  const [name, setName] = useStorageState<string>("", "name", "sessionStorage");
  const [lastName, setLastName] = useStorageState<string>("", "lastName", "sessionStorage");
  const [email, setEmail] = useStorageState("", "email", "sessionStorage");
  const [phoneNumber, setPhoneNumber] = useStorageState("", "phoneNumber", "sessionStorage");
  const [emoji, setEmoji] = useStorageState<string | null>(null, "emoji", "sessionStorage");
  const [color, setColor] = useStorageState<string>(theme.primary, "color", "sessionStorage");
  const [description, setDescription] = useStorageState<string>("", "description", "sessionStorage",
  );
  const [deadline] = useStorageState<string>("", "deadline", "sessionStorage");
  const [nameError, setNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useStorageState<Category[]>(
    [],
    "categories",
    "sessionStorage",
  );



  const n = useNavigate();

  useEffect(() => {
    document.title = "Contacto - Contacto";
  }, []);

  useEffect(() => {
    if (name.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
    if (lastName.length > TASK_NAME_MAX_LENGTH) {
      setLastNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    }
    if (email.length > TASK_NAME_MAX_LENGTH) {
      setEmailError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    }
    if (phoneNumber.length > TASK_PHONE_MAX_LENGTH) {
      setPhoneNumberError(`Name should be less than or equal to ${TASK_PHONE_MAX_LENGTH} characters`);
    }
    if (description.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`,
      );
    } else {
      setDescriptionError("");
    }
  }, [description.length, name.length, lastName.length]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setNameError("");
    }
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLastName = event.target.value;
    setLastName(newLastName);
    if (newLastName.length > TASK_NAME_MAX_LENGTH) {
      setLastNameError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setLastNameError("");
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    if (newEmail.length > TASK_NAME_MAX_LENGTH) {
      setEmailError(`Name should be less than or equal to ${TASK_NAME_MAX_LENGTH} characters`);
    } else {
      setEmailError("");
    }
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = event.target.value;
    setPhoneNumber(newPhoneNumber);
    if (newPhoneNumber.length > TASK_PHONE_MAX_LENGTH) {
      setPhoneNumberError(`Name should be less than or equal to ${TASK_PHONE_MAX_LENGTH} characters`);
    } else {
      setPhoneNumberError("");
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setDescription(newDescription);
    if (newDescription.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Description should be less than or equal to ${DESCRIPTION_MAX_LENGTH} characters`,
      );
    } else {
      setDescriptionError("");
    }
  };



  const handleAddTask = () => {
    if (name === "") {
      showToast("Nombre del contacto es requerido.", { type: "error" });
      return;
    }

    if (nameError !== "" || descriptionError !== "") {
      return; // Do not add the task if the name or description exceeds the maximum length
    }

    const newTask: Task = {
      id: generateUUID(),
      done: false,
      pinned: false,
      name,
      lastName,
      email,
      phoneNumber,
      description: description !== "" ? description : undefined,
      emoji: emoji ? emoji : undefined,
      color,
      date: new Date(),
      deadline: deadline !== "" ? new Date(deadline) : undefined,
      category: selectedCategories ? selectedCategories : [],
    };

    setUser((prevUser) => ({
      ...prevUser,
      tasks: [...prevUser.tasks, newTask],
    }));

    n("/");

    showToast(
      <div>
        Contacto Guardado - <b>{newTask.name}</b>
      </div>,
      {
        icon: <AddTaskRounded />,
      },
    );

    const itemsToRemove = ["name","lastName","email","phoneNumber", "color", "description", "emoji", "deadline", "categories"];
    itemsToRemove.map((item) => sessionStorage.removeItem(item));
  };

  

  return (
    <>
      <TopBar title="Nuevo Contacto" />
      <Container>
        <CustomEmojiPicker
          emoji={typeof emoji === "string" ? emoji : undefined}
          setEmoji={setEmoji}
          color={color}
          name={name}
          type="task"
        />
        {/* fix for input colors */}
        <InputThemeProvider>
          <StyledInput
            label="Nombre Completo"
            name="name"
            placeholder="Hugo Frias"
            autoComplete="off"
            value={name}
            onChange={handleNameChange}
            required
            error={nameError !== ""}
            helpercolor={nameError && ColorPalette.red}
            helperText={
              name === ""
                ? undefined
                : !nameError
                  ? `${name.length}/${TASK_NAME_MAX_LENGTH}`
                  : nameError
            }
          />
          <StyledInput
            label = "Apellidos"
            name = "lastName"
            placeholder = "Frias"
            autoComplete = "off"
            value = {lastName}
            onChange = {handleLastNameChange}
            required
            error = {lastNameError !== ""}
            helpercolor = {lastNameError && ColorPalette.red}
            helperText = {
              lastName === ""
                ? undefined
                : !lastNameError
                  ? `${lastName.length}/${TASK_NAME_MAX_LENGTH}`
                  : lastNameError
            }
          />
          <StyledInput
            label = "Correo"
            name = "email"
            placeholder = "hugo.frias@hotmail.com"
            autoComplete = "off"
            value = {email}
            onChange = {handleEmailChange}
            required
            error = {emailError !== ""}
            helpercolor = {emailError && ColorPalette.red}
            helperText = {
              email === ""
                ? undefined
                : !emailError
                  ? `${email.length}/${TASK_NAME_MAX_LENGTH}`
                  : emailError
            }
          />

          <StyledInput
            label = "Telefono"
            name = "phoneNumber"
            placeholder = "1234567890"
            autoComplete = "off"
            value = {phoneNumber}
            onChange = {handlePhoneNumberChange}
            required
            error = {phoneNumberError !== ""}
            helpercolor = {phoneNumberError && ColorPalette.red}
            helperText = {
              phoneNumber === ""
                ? undefined
                : !phoneNumberError
                  ? `${phoneNumber.length}/${TASK_PHONE_MAX_LENGTH}`
                  : phoneNumberError
            }
          />
          <StyledInput
            label="Descripción"
            name="name"
            placeholder="Haz una descripcion del Contacto"
            autoComplete="off"
            value={description}
            onChange={handleDescriptionChange}
            multiline
            rows={4}
            error={descriptionError !== ""}
            helpercolor={descriptionError && ColorPalette.red}
            helperText={
              description === ""
                ? undefined
                : !descriptionError
                  ? `${description.length}/${DESCRIPTION_MAX_LENGTH}`
                  : descriptionError
            }
          />
          {/* <StyledInput
            label="Task Deadline"
            name="name"
            placeholder="Enter deadline date"
            type="datetime-local"
            value={deadline}
            onChange={handleDeadlineChange}
            onFocus={() => setIsDeadlineFocused(true)}
            onBlur={() => setIsDeadlineFocused(false)}
            hidetext={(!deadline || deadline === "") && !isDeadlineFocused} // fix for label overlapping with input
            sx={{
              colorScheme: isDark(theme.secondary) ? "dark" : "light",
            }}
            InputProps={{
              startAdornment:
                deadline && deadline !== "" ? (
                  <InputAdornment position="start">
                    <Tooltip title="Clear">
                      <IconButton color="error" onClick={() => setDeadline("")}>
                        <CancelRounded />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ) : undefined,
            }}
          /> */}
          {user.settings.enableCategories !== undefined && user.settings.enableCategories && (
            <div style={{ marginBottom: "14px" }}>
              <br />
              <CategorySelect
                selectedCategories={selectedCategories}
                onCategoryChange={(categories) => setSelectedCategories(categories)}
                width="400px"
                fontColor={getFontColor(theme.secondary)}
              />
            </div>
          )}
        </InputThemeProvider>
        <ColorPicker
          color={color}
          width="400px"
          onColorChange={(color) => {
            setColor(color);
          }}
          fontColor={getFontColor(theme.secondary)}
        />
        <AddTaskButton
          onClick={handleAddTask}
          disabled={
            name.length > TASK_NAME_MAX_LENGTH || description.length > DESCRIPTION_MAX_LENGTH
          }
        >
          Crear Contacto
        </AddTaskButton>
      </Container>
    </>
  );
};

export default AddTask;
