import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import {
  AddRounded,
  CategoryRounded,
  DownloadDoneRounded,
  FiberManualRecord,
  GitHub,
  InstallDesktopRounded,
  InstallMobileRounded,
  IosShareRounded,
  Logout,
  PhoneIphoneRounded,
  SettingsRounded,
  TaskAltRounded,
  ThumbUpRounded,
} from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  SwipeableDrawer,
  Tooltip,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomDialogTitle, SettingsDialog } from ".";
import logo from "../assets/logo256.png";
import { defaultUser } from "../constants/defaultUser";
import { UserContext } from "../contexts/UserContext";
import { DialogBtn, UserAvatar, pulseAnimation, ring } from "../styles";
import { ColorPalette } from "../theme/themeConfig";
import { showToast, systemInfo} from "../utils";

export const ProfileSidebar = () => {
  const { user, setUser } = useContext(UserContext);
  const { name, profilePicture, tasks, settings } = user;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);


  const n = useNavigate();



  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutConfirmationOpen = () => {
    setLogoutConfirmationOpen(true);
    setAnchorEl(null);
  };

  const handleLogoutConfirmationClose = () => {
    setLogoutConfirmationOpen(false);
  };

  const handleLogout = () => {
    setUser(defaultUser);
    handleLogoutConfirmationClose();
    showToast("Has cerrado sesión exitosamente");
  };

  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: ReadonlyArray<string>;
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
    prompt(): Promise<void>;
  }

  const [supportsPWA, setSupportsPWA] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  const [openInstalledDialog, setOpenInstalledDialog] = useState<boolean>(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const detectAppInstallation = () => {
      window.matchMedia("(display-mode: standalone)").addEventListener("change", (e) => {
        setIsAppInstalled(e.matches);
      });
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    detectAppInstallation();

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    };
  }, []);

  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          if ("setAppBadge" in navigator) {
            setUser((prevUser) => ({
              ...prevUser,
              settings: {
                ...prevUser.settings,
                appBadge: true,
              },
            }));
          }
          // Show a dialog to inform the user that the app is now running as a PWA on Windows
          if (systemInfo.os === "Windows") {
            setOpenInstalledDialog(true);
          } else {
            showToast("¡Aplicación instalada con éxito!");
          }
          handleClose();
        }
        if (choiceResult.outcome === "dismissed") {
            showToast("Instalación cancelada.", { type: "error" });
        }
      });
    }
  };

  return (
    <Container>
      <Tooltip title={<div translate={name ? "no" : "yes"}>{name || "Usuario"}</div>}>
        <IconButton
          aria-label="Sidebar"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ zIndex: 1 }}
        >
          <UserAvatar
            src={(profilePicture as string) || undefined}
            alt={name || "Usuario"}
            hasimage={profilePicture !== null}
            pulse={
              user.name === defaultUser.name &&
              JSON.stringify(user.settings) === JSON.stringify(defaultUser.settings)
            }
            size="52px"
            onError={() => {
              // This prevents the error handling from being called unnecessarily when offline
              if (!navigator.onLine) return;
              setUser((prevUser) => ({
                ...prevUser,
                profilePicture: null,
              }));
                showToast("Error en la URL de la imagen de perfil", { type: "error" });
                throw new Error("Error en la URL de la imagen de perfil");
            }}
          >
            {name ? name[0].toUpperCase() : undefined}
          </UserAvatar>
        </IconButton>
      </Tooltip>
      <StyledSwipeableDrawer
        disableBackdropTransition={systemInfo.os !== "iOS"}
        disableDiscovery={systemInfo.os === "iOS"}
        id="basic-menu"
        anchor="right"
        open={open}
        onOpen={(e) => e.preventDefault()}
        onClose={handleClose}
      >
        <LogoContainer
          translate="no"
          onClick={() => {
            n("/");
            handleClose();
          }}
        >
          <Logo src={logo} alt="logo" />
          <LogoText>
            <span>Agenda</span> Personal
            <span>.</span>
          </LogoText>
        </LogoContainer>

        <MenuLink to="/">
          <StyledMenuItem onClick={handleClose}>
            <TaskAltRounded /> &nbsp; Contactos
            {tasks.filter((task) => !task.done).length > 0 && (
              <Tooltip title={`${tasks.filter((task) => !task.done).length} tasks to do`}>
                <MenuLabel>
                  {tasks.filter((task) => !task.done).length > 99
                    ? "99+"
                    : tasks.filter((task) => !task.done).length}
                </MenuLabel>
              </Tooltip>
            )}
          </StyledMenuItem>
        </MenuLink>

        <MenuLink to="/add">
          <StyledMenuItem onClick={handleClose}>
            <AddRounded /> &nbsp; Agregar Contacto
          </StyledMenuItem>
        </MenuLink>

        {settings.enableCategories !== undefined && settings.enableCategories && (
          <MenuLink to="/categories">
            <StyledMenuItem onClick={handleClose}>
              <CategoryRounded /> &nbsp; Categorias
            </StyledMenuItem>
          </MenuLink>
        )}


        <StyledDivider />

        <MenuLink to="https://github.com/hugofriasmtz">
          <StyledMenuItem translate="yes">
            <GitHub /> &nbsp; Github{" "}
          </StyledMenuItem>
        </MenuLink>

        <StyledDivider />

        {supportsPWA && !isAppInstalled && (
          <StyledMenuItem onClick={installPWA}>
            {systemInfo.os === "Android" ? <InstallMobileRounded /> : <InstallDesktopRounded />}
            &nbsp; Acceso Directo
          </StyledMenuItem>
        )}

        {systemInfo.browser === "Safari" &&
          systemInfo.os === "iOS" &&
          !window.matchMedia("(display-mode: standalone)").matches && (
            <StyledMenuItem
              onClick={() => {
                showToast(
                    <div style={{ display: "inline-block" }}>
                    Para instalar la aplicación en iOS Safari, haz clic en{" "}
                    <IosShareRounded sx={{ verticalAlign: "middle", mb: "4px" }} /> y luego{" "}
                    <span style={{ fontWeight: "bold" }}>Agregar a la pantalla de inicio</span>.
                    </div>,
                  { type: "blank", duration: 8000 },
                );
                handleClose();
              }}
            >
              <PhoneIphoneRounded />
              &nbsp; Instala la App 
            </StyledMenuItem>
          )}

        <StyledMenuItem onClick={handleLogoutConfirmationOpen} sx={{ color: "#ff4040 !important" }}>
          <Logout /> &nbsp; Cerrar Sesión
        </StyledMenuItem>

        <ProfileOptionsBottom>
          <SettingsMenuItem
            onClick={() => {
              setOpenSettings(true);
              handleClose();
            }}
          >
            <SettingsRounded /> &nbsp; Cofiguracion
            {JSON.stringify(settings) === JSON.stringify(defaultUser.settings) &&
              user.darkmode === defaultUser.darkmode &&
              user.theme === defaultUser.theme &&
              user.emojisStyle === defaultUser.emojisStyle && <PulseMenuLabel />}
          </SettingsMenuItem>

          <StyledDivider />
          <MenuLink to="/user">
            <ProfileMenuItem translate={name ? "no" : "yes"} onClick={handleClose}>
              <UserAvatar
                src={(profilePicture as string) || undefined}
                hasimage={profilePicture !== null}
                size="44px"
              >
                {name ? name[0].toUpperCase() : undefined}
              </UserAvatar>
              <h4 style={{ margin: 0, fontWeight: 600 }}> {name || "User"}</h4>{" "}
              {(name === null || name === "") && profilePicture === null && <PulseMenuLabel />}
            </ProfileMenuItem>
          </MenuLink>

      

        </ProfileOptionsBottom>
      </StyledSwipeableDrawer>

      <Dialog open={openInstalledDialog} onClose={() => setOpenInstalledDialog(false)}>
        <CustomDialogTitle
          title="¡Aplicación instalada con éxito!"
          subTitle="La aplicación ahora se está ejecutando como PWA."
          icon={<DownloadDoneRounded />}
          onClose={() => setOpenInstalledDialog(false)}
        />
        <DialogContent>
          Puedes acceder a ella desde tu pantalla de inicio, con soporte sin conexión y funciones como accesos directo.
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={() => setOpenInstalledDialog(false)}>
        <ThumbUpRounded /> &nbsp; Entendido
          </DialogBtn>
        </DialogActions>
      </Dialog>

      <Dialog open={logoutConfirmationOpen} onClose={handleLogoutConfirmationClose}>
        <CustomDialogTitle title="Logout Confirmation" icon={<Logout />} />
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
      <SettingsDialog open={openSettings} onClose={() => setOpenSettings(!openSettings)} />
    </Container>
  );
};

const MenuLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const styles: React.CSSProperties = { borderRadius: "14px" };
  if (to.startsWith("/")) {
    return (
      // React Router Link component for internal navigation
      <Link to={to} style={styles}>
        {children}
      </Link>
    );
  }
  // Render an anchor tag for external navigation
  return (
    <a href={to} target="_blank" style={styles}>
      {children}
    </a>
  );
};

const Container = styled.div`
  position: absolute;
  right: 16vw;
  top: 14px;
  z-index: 900;
  @media (max-width: 1024px) {
    right: 16px;
  }
`;

const StyledSwipeableDrawer = styled(SwipeableDrawer)`
  & .MuiPaper-root {
    border-radius: 24px 0 0 0;
    min-width: 300px;
    box-shadow: none;
    padding: 4px 12px;
    color: ${({ theme }) => (theme.darkmode ? ColorPalette.fontLight : "#101727")};
    z-index: 999;

    @media (min-width: 1920px) {
      min-width: 310px;
    }

    @media (max-width: 1024px) {
      min-width: 270px;
    }

    @media (max-width: 600px) {
      min-width: 55vw;
    }
  }
`;
const LogoutAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.9) translateX(-2px);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const InstallAppAnimation = keyframes`
   0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
  50% {
    transform: translateY(2px);
  }
  70% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
`;

const StyledMenuItem = styled(MenuItem)`
  /* margin: 0px 8px; */
  padding: 16px 12px;
  border-radius: 14px;
  box-shadow: none;
  font-weight: 500;
  gap: 6px;

  & svg,
  .bmc-icon {
    transition: 0.4s transform;
  }

  &:hover {
    & svg[data-testid="GitHubIcon"] {
      transform: rotateY(${2 * Math.PI}rad);
    }
    & svg[data-testid="BugReportRoundedIcon"] {
      transform: rotate(45deg) scale(1.1) translateY(-10%);
    }

    & svg[data-testid="InstallDesktopRoundedIcon"] {
      animation: ${InstallAppAnimation} 0.8s ease-in alternate;
    }

    & svg[data-testid="LogoutIcon"] {
      animation: ${LogoutAnimation} 0.5s ease-in alternate;
    }

    & .bmc-icon {
      animation: ${ring} 2.5s ease-in alternate;
    }
  }
`;

const SettingsMenuItem = styled(StyledMenuItem)`
  background: ${({ theme }) => (theme.darkmode ? "#1f1f1f" : "#101727")};
  color: ${ColorPalette.fontLight} !important;
  margin-top: 8px !important;
  &:hover {
    background: ${({ theme }) => (theme.darkmode ? "#1f1f1fb2" : "#101727b2")};
    & svg[data-testid="SettingsRoundedIcon"] {
      transform: rotate(180deg);
    }
  }
`;

const ProfileMenuItem = styled(StyledMenuItem)`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => (theme.darkmode ? "#1f1f1f" : "#d7d7d7")};
  &:hover {
    background: ${({ theme }) => (theme.darkmode ? "#1f1f1fb2" : "#d7d7d7b2")};
  }
`;

const MenuLabel = styled.span<{ clr?: string }>`
  margin-left: auto;
  font-weight: 600;
  background: ${({ clr, theme }) => (clr || theme.primary) + "35"};
  color: ${({ clr, theme }) => clr || theme.primary};
  padding: 2px 12px;
  border-radius: 32px;
  font-size: 14px;
`;

const StyledDivider = styled(Divider)`
  margin: 8px 4px;
`;

const PulseMenuLabel = styled(MenuLabel)`
  animation: ${({ theme }) => pulseAnimation(theme.primary, 6)} 1.2s infinite;
  padding: 6px;
  margin-right: 4px;
`;

PulseMenuLabel.defaultProps = {
  children: (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FiberManualRecord style={{ fontSize: "16px" }} />
    </div>
  ),
};

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
  margin-bottom: 16px;
  gap: 12px;
  cursor: pointer;
`;

const Logo = styled.img`
  width: 52px;
  height: 52px;
  margin-left: 12px;
  border-radius: 14px;
`;

const LogoText = styled.h2`
  & span {
    color: #f48a17;
  }
`;

// const BmcIcon = styled.img`
//   width: 1em;
//   height: 1em;
//   font-size: 1.5rem;
// `;

const ProfileOptionsBottom = styled.div`
  margin-top: auto;
  margin-bottom: ${window.matchMedia("(display-mode: standalone)").matches &&
  /Mobi/.test(navigator.userAgent)
    ? "38px"
    : "16px"};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// const CreditsContainer = styled.div`
//   font-size: 12px;
//   margin: 0;
//   opacity: 0.8;
//   text-align: center;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   & span {
//     backdrop-filter: none !important;
//   }
// `;
