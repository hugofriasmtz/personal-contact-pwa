import styled from "@emotion/styled";
import {  EditCalendarRounded, SaveRounded } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { ColorPicker, CustomDialogTitle, CustomEmojiPicker } from ".";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH, TASK_PHONE_MAX_LENGTH } from "../constants";
import { UserContext } from "../contexts/UserContext";
import { DialogBtn } from "../styles";
import { Category, Task } from "../types/user";
import { showToast } from "../utils";
import { useTheme } from "@emotion/react";
import { ColorPalette } from "../theme/themeConfig";
import { CategorySelect } from "./CategorySelect";

interface EditTaskProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
  onSave: (editedTask: Task) => void;
}

export const EditTask = ({ open, task, onClose, onSave }: EditTaskProps) => {
  const { user } = useContext(UserContext);
  const { settings } = user;
  const [editedTask, setEditedTask] = useState<Task | undefined>(task);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const theme = useTheme();

  const nameError = useMemo(
    () => (editedTask?.name ? editedTask.name.length > TASK_NAME_MAX_LENGTH : undefined),
    [editedTask?.name],
  );
  const descriptionError = useMemo(
    () =>
      editedTask?.description ? editedTask.description.length > DESCRIPTION_MAX_LENGTH : undefined,
    [editedTask?.description],
  );

  // Effect hook to update the editedTask with the selected emoji.
  useEffect(() => {
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      emoji: emoji || undefined,
    }));
  }, [emoji]);

  // Effect hook to update the editedTask when the task prop changes.
  useEffect(() => {
    setEditedTask(task);
    setSelectedCategories(task?.category as Category[]);
  }, [task]);

  // Event handler for input changes in the form fields.
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Update the editedTask state with the changed value.
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      [name]: value,
    }));
  };
  // Event handler for saving the edited task.
  const handleSave = () => {
    document.body.style.overflow = "auto";
    if (editedTask && !nameError && !descriptionError) {
      onSave(editedTask);
      showToast(
        <div>
          Task <b translate="no">{editedTask.name}</b> updated.
        </div>,
      );
    }
  };

  const handleCancel = () => {
    onClose();
    setEditedTask(task);
    setSelectedCategories(task?.category as Category[]);
  };

  useEffect(() => {
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      category: (selectedCategories as Category[]) || undefined,
    }));
  }, [selectedCategories]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (JSON.stringify(editedTask) !== JSON.stringify(task) && open) {
        const message = "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?";
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editedTask, open, task]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      PaperProps={{
        style: {
          borderRadius: "24px",
          padding: "12px",
          maxWidth: "600px",
        },
      }}
        >
      <CustomDialogTitle
        title="Editar Contacto"
        subTitle={
          editedTask?.lastSave
        ? `Última Edición: ${new Date(editedTask.lastSave).toLocaleDateString()} • ${new Date(editedTask.lastSave).toLocaleTimeString()}`
        : "Edita los detalles del Contacto."
        }
        icon={<EditCalendarRounded />}
        onClose={onClose}
      />
      <DialogContent>
        <CustomEmojiPicker
          emoji={editedTask?.emoji || undefined}
          setEmoji={setEmoji}
          color={editedTask?.color}
          name={editedTask?.name || ""}
          type="task"
        />
        <StyledInput
          label="Nombres"
          name="name"
          autoComplete="off"
          value={editedTask?.name || ""}
          onChange={handleInputChange}
          error={nameError || editedTask?.name === ""}
          helperText={
            editedTask?.name
              ? editedTask?.name.length === 0
                ? "Name is required"
                : editedTask?.name.length > TASK_NAME_MAX_LENGTH
                  ? `Name is too long (maximum ${TASK_NAME_MAX_LENGTH} characters)`
                  : `${editedTask?.name?.length}/${TASK_NAME_MAX_LENGTH}`
              : "Name is required"
          }
        />
        <StyledInput
          label="Apellidos"
          name="lastName"
          autoComplete="off"
          value={editedTask?.lastName || ""}
          onChange={handleInputChange}
          error={nameError || editedTask?.lastName === ""}
          helperText={
            editedTask?.lastName
              ? editedTask?.lastName.length === 0
                ? "Last Name is required"
                : editedTask?.lastName.length > TASK_NAME_MAX_LENGTH
                  ? `Last Name is too long (maximum ${TASK_NAME_MAX_LENGTH} characters)`
                  : `${editedTask?.lastName?.length}/${TASK_NAME_MAX_LENGTH}`
              : "Last Name is required"
          }
        />
        <StyledInput
          label="Email"
          name="email"
          autoComplete="off"
          value={editedTask?.email || ""}
          onChange={handleInputChange}
          error={nameError || editedTask?.email === ""}
          helperText={
            editedTask?.email
              ? editedTask?.email.length === 0
                ? "Email is required"
                : editedTask?.email.length > TASK_NAME_MAX_LENGTH
                  ? `Email is too long (maximum ${TASK_NAME_MAX_LENGTH} characters)`
                  : `${editedTask?.email?.length}/${TASK_NAME_MAX_LENGTH}`
              : "Email is required"
          }
        />
        <StyledInput
          label="Teléfono"
          name="phoneNumber"
          autoComplete="off"
          value={editedTask?.phoneNumber || ""}
          onChange={handleInputChange}
          error={nameError || editedTask?.phoneNumber === ""}
          helperText={
            editedTask?.phoneNumber
              ? editedTask?.phoneNumber.length === 0
                ? "Phone Number is required"
                : editedTask?.phoneNumber.length > TASK_PHONE_MAX_LENGTH
                  ? `Phone Number is too long (maximum ${TASK_PHONE_MAX_LENGTH} characters)`
                  : `${editedTask?.phoneNumber?.length}/${TASK_PHONE_MAX_LENGTH}`
              : "Phone Number is required"
          }
        />
        <StyledInput
          label="Descripción"
          name="description"
          autoComplete="off"
          value={editedTask?.description || ""}
          onChange={handleInputChange}
          multiline
          rows={4}
          margin="normal"
          error={descriptionError}
          helperText={
            editedTask?.description === "" || editedTask?.description === undefined
              ? undefined
              : descriptionError
                ? `Description is too long (maximum ${DESCRIPTION_MAX_LENGTH} characters)`
                : `${editedTask?.description?.length}/${DESCRIPTION_MAX_LENGTH}`
          }
        />
        {settings.enableCategories !== undefined && settings.enableCategories && (
          <CategorySelect
            fontColor={theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark}
            selectedCategories={selectedCategories}
            onCategoryChange={(categories) => setSelectedCategories(categories)}
          />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          <ColorPicker
            width={"100%"}
            color={editedTask?.color || "#000000"}
            fontColor={theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark}
            onColorChange={(color) => {
              setEditedTask((prevTask) => ({
                ...(prevTask as Task),
                color: color,
              }));
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <DialogBtn onClick={handleCancel}>Cancelar</DialogBtn>
        <DialogBtn
          onClick={handleSave}
          color="primary"
          disabled={
            nameError ||
            editedTask?.name === "" ||
            descriptionError ||
            nameError ||
            JSON.stringify(editedTask) === JSON.stringify(task)
          }
        >
          <SaveRounded /> &nbsp; Guardar
        </DialogBtn>
      </DialogActions>
    </Dialog>
  );
};

const StyledInput = styled(TextField)`
  margin: 14px 0;
  & .MuiInputBase-root {
    border-radius: 16px;
  }
`;
StyledInput.defaultProps = {
  fullWidth: true,
};
