import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  AddAPhotoRounded,
  Delete,
  LinkRounded,
  Logout,
  SaveRounded,
  Settings,
  TodayRounded,
} from "@mui/icons-material";
import { PROFILE_PICTURE_MAX_LENGTH, USER_NAME_MAX_LENGTH } from "../constants";
import { CustomDialogTitle, SettingsDialog, TopBar } from "../components";
import { DialogBtn, UserAvatar } from "../styles";
import { defaultUser } from "../constants/defaultUser";
import { UserContext } from "../contexts/UserContext";
import { timeAgo, getFontColor, showToast } from "../utils";
import { ColorPalette } from "../theme/themeConfig";

const UserProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const { name, profilePicture, createdAt } = user;
  const [userName, setUserName] = useState<string>("");
  const [profilePictureURL, setProfilePictureURL] = useState<string>("");
  const [openChangeImage, setOpenChangeImage] = useState<boolean>(false);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  useEffect(() => {
    document.title = `Contactos - Usuario ${name ? `(${name})` : ""}`;
  }, [name]);

  const handleSaveName = () => {
    if (userName.length <= USER_NAME_MAX_LENGTH && userName !== name) {
      setUser({ ...user, name: userName });

      showToast(
        <div>
          Nombre de usuario cambiado
          {userName && (
            <>
              {" "}
              a <b translate="no">{userName}</b>
            </>
          )}
          .
        </div>,
      );

      setUserName("");
    }
  };

  const handleOpenImageDialog = () => {
    setOpenChangeImage(true);
  };
  const handleCloseImageDialog = () => {
    setOpenChangeImage(false);
  };

  const handleLogoutConfirmationClose = () => {
    setLogoutConfirmationOpen(false);
  };
  const handleLogout = () => {
    setUser(defaultUser);
    handleLogoutConfirmationClose();
    showToast("Has cerrado sesión exitosamente");
  };

  const handleSaveImage = () => {
    if (
      profilePictureURL.length <= PROFILE_PICTURE_MAX_LENGTH &&
      profilePictureURL.startsWith("https://")
    ) {
      handleCloseImageDialog();
      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: profilePictureURL,
      }));
      showToast("Imagen de perfil cambiada.");
    }
  };

  return (
    <>
      <TopBar title="Perfil de Usuario" />
      <Container>
        <Tooltip title="Configuración">
          <IconButton
            onClick={() => setOpenSettings(true)}
            aria-label="Settings"
            size="large"
            sx={{
              position: "absolute",
              top: "24px",
              right: "24px",
            }}
          >
            <Settings fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title={profilePicture ? "Cambiar foto de perfil" : "Agregar foto de perfil"}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
          onClick={handleOpenImageDialog}
          sx={{
            background: "#9c9c9c81",
            backdropFilter: "blur(10px)",
            cursor: "pointer",
          }}
              >
          <AddAPhotoRounded />
              </Avatar>
            }
          >
            <UserAvatar
              onClick={handleOpenImageDialog}
              src={profilePicture || undefined}
              hasimage={profilePicture !== null}
              style={{ cursor: "pointer" }}
              size="96px"
            >
              {name ? name[0].toUpperCase() : undefined}
            </UserAvatar>
          </Badge>
        </Tooltip>
        <UserName translate={name ? "no" : "yes"}>{name || "Usuario"}</UserName>
        <Tooltip
          title={new Intl.DateTimeFormat(navigator.language, {
            dateStyle: "full",
            timeStyle: "medium",
          }).format(new Date(createdAt))}
        >
          <CreatedAtDate>
            <TodayRounded fontSize="small" />
            &nbsp;Restigrado {timeAgo(createdAt)}
          </CreatedAtDate>
        </Tooltip>

        <TextField
          sx={{ width: "300px", marginTop: "8px" }}
          label={name === null ? "Agregar Nombre" : "Cambiar Nombre"}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
          error={userName.length > USER_NAME_MAX_LENGTH || (userName === name && name !== "")}
          helperText={
            userName.length > USER_NAME_MAX_LENGTH
              ? `El nombre excede los ${USER_NAME_MAX_LENGTH} caracteres`
              : userName.length > 0 && userName !== name
          ? `${userName.length}/${USER_NAME_MAX_LENGTH}`
          : userName === name && name !== ""
            ? "El nuevo nombre de usuario coincide con el anterior."
            : ""
          }
          autoComplete="nickname"
        />

        <SaveBtn
          onClick={handleSaveName}
          disabled={userName.length > USER_NAME_MAX_LENGTH || userName === name}
        >
          Guardar Nombre
        </SaveBtn>
        <Button
          color="error"
          variant="outlined"
          sx={{ p: "12px 20px", borderRadius: "14px", marginTop: "8px" }}
          onClick={() => setLogoutConfirmationOpen(true)}
        >
          <Logout />
          &nbsp; Salir
        </Button>
      </Container>
      <Dialog open={openChangeImage} onClose={handleCloseImageDialog}>
        <CustomDialogTitle
          title="Foto de Perfil"
          subTitle="Cambiar o eliminar foto de perfil"
          onClose={handleCloseImageDialog}
          icon={<AddAPhotoRounded />}
        />
        <DialogContent>
          <TextField
        autoFocus
        label="Enlace a la foto de perfil"
        placeholder="Introduce el enlace a la foto de perfil..."
        sx={{ my: "8px", width: "100%" }}
        value={profilePictureURL}
        onChange={(e) => {
          setProfilePictureURL(e.target.value);
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSaveImage()}
        error={profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH}
        helperText={
          profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH
            ? `La URL es demasiado larga, máximo ${PROFILE_PICTURE_MAX_LENGTH} caracteres`
            : ""
        }
        autoComplete="url"
        type="url"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
          <LinkRounded />
            </InputAdornment>
          ),
        }}
          />

          <br />
          {profilePicture !== null && (
        <Button
          fullWidth
          onClick={() => {
            handleCloseImageDialog();
            showToast("Imagen de perfil eliminada.");
            setUser({ ...user, profilePicture: null });
          }}
          color="error"
          variant="outlined"
          sx={{ margin: "16px 0", p: "12px 20px", borderRadius: "14px" }}
        >
          <Delete /> &nbsp; Eliminar Imagen
        </Button>
          )}
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={handleCloseImageDialog}>Cancelar</DialogBtn>
          <DialogBtn
        disabled={
          profilePictureURL.length > PROFILE_PICTURE_MAX_LENGTH ||
          !profilePictureURL.startsWith("https://")
        }
        onClick={handleSaveImage}
          >
        <SaveRounded /> &nbsp; Guardar
          </DialogBtn>
        </DialogActions>
      </Dialog>
      <Dialog open={logoutConfirmationOpen} onClose={handleLogoutConfirmationClose}>
        <CustomDialogTitle title="Confirmación de Cierre de Sesión" icon={<Logout />} />
        <DialogContent>
          ¿Estás seguro de que deseas cerrar sesión? <b>Tus Contactos no se guardarán.</b>
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={handleLogoutConfirmationClose}>Cancelar</DialogBtn>
          <DialogBtn onClick={handleLogout} color="error">
        <Logout /> &nbsp; Salir
          </DialogBtn>
        </DialogActions>
      </Dialog>
      <SettingsDialog open={openSettings} onClose={() => setOpenSettings(false)} />
    </>
  );
};

export default UserProfile;

const Container = styled.div`
  margin: 0 auto;
  max-width: 400px;
  padding: 64px 38px;
  border-radius: 48px;
  box-shadow: 0px 4px 50px rgba(0, 0, 0, 0.25);
  background: ${({ theme }) => (theme.darkmode ? "#383838" : "#f5f5f5")};
  color: ${({ theme }) => (theme.darkmode ? ColorPalette.fontLight : ColorPalette.fontDark)};
  transition:
    border 0.3s,
    box-shadow 0.3s;
  border: 4px solid ${({ theme }) => theme.primary};
  box-shadow: 0 0 72px -1px ${({ theme }) => theme.primary + "bf"};
  display: flex;
  gap: 14px;
  flex-direction: column;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const SaveBtn = styled(Button)`
  width: 300px;
  font-weight: 600;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => getFontColor(theme.primary)};
  font-size: 18px;
  padding: 14px;
  border-radius: 16px;
  cursor: pointer;
  text-transform: capitalize;
  transition:
    background 0.3s,
    color 0.3s;
  &:hover {
    background: ${({ theme }) => theme.primary};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    color: white;
  }
`;

const UserName = styled.span`
  font-size: 20px;
  font-weight: 500;
`;

const CreatedAtDate = styled.span`
  display: flex;
  align-items: center;
  font-style: italic;
  font-weight: 400;
  opacity: 0.8;
  margin-top: -8px;
  margin-bottom: 2px;
  // fix for browser translate
  & font {
    margin: 0 1px;
  }
`;
