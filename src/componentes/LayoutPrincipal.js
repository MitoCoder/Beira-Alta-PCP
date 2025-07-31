import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Box,
  InputBase,
  alpha,
  Paper,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

const rotas = [
  { nome: 'Produção', caminho: '/' },
  { nome: 'Pedidos', caminho: '/pedidos' },
  { nome: 'Produtos', caminho: '/produtos' },
  { nome: 'Dashboard', caminho: '/dashboard' },
  { nome: 'Estoque', caminho: '/inventario' },
  { nome: 'Relatórios', caminho: '/relatorios' },
  { nome: 'Configurações', caminho: '/configuracoes' },
];

export default function LayoutPrincipal({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [busca, setBusca] = useState('');
  const [aberto, setAberto] = useState(false);

  const inputRef = useRef(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Filtra rotas para sugestões baseado na busca
  const rotasFiltradas = busca
    ? rotas.filter((rota) =>
        rota.nome.toLowerCase().includes(busca.toLowerCase())
      )
    : [];

  // Fecha o dropdown ao clicar fora
  const handleClickAway = () => {
    setAberto(false);
  };

  // Navega pra rota clicada e fecha dropdown + limpa busca
  const handleSugestaoClick = (caminho) => {
    navigate(caminho);
    setBusca('');
    setAberto(false);
    inputRef.current.blur();
  };

  // Abre dropdown ao digitar e fecha ao apagar tudo
  useEffect(() => {
    if (busca.trim() !== '') {
      setAberto(true);
    } else {
      setAberto(false);
    }
  }, [busca]);

  const searchStyles = {
    position: 'relative',
    borderRadius: 1,
    backgroundColor: alpha('#ffffff', 0.15),
    '&:hover': {
      backgroundColor: alpha('#ffffff', 0.25),
    },
    marginLeft: 3,
    width: 'auto',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <>
      {/* Barra superior com título, logo, busca, notificações e avatar */}
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            {/* Logo */}
            <img
              src="/logo192.png" // Troque pela sua logo
              alt="Logo"
              style={{ width: 40, height: 40, marginRight: 12, borderRadius: 6 }}
            />
            <Typography variant="h6" component="div" fontWeight="bold" noWrap>
              Sistema PCP
            </Typography>

            {/* Campo de busca com dropdown */}
            <Box sx={{ ...searchStyles, ml: 3, position: 'relative' }}>
              <SearchIcon sx={{ ml: 1, color: 'inherit' }} />
              <InputBase
                placeholder="Buscar..."
                inputProps={{ 'aria-label': 'buscar' }}
                sx={{ ml: 1, color: 'inherit', width: 400 }}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onFocus={() => busca.trim() && setAberto(true)}
                ref={inputRef}
              />

              {aberto && rotasFiltradas.length > 0 && (
                <ClickAwayListener onClickAway={handleClickAway}>
                  <Paper
                    elevation={3}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      mt: 0.5,
                      maxHeight: 240,
                      overflowY: 'auto',
                    }}
                  >
                    <List dense>
                      {rotasFiltradas.map((rota) => (
                        <ListItemButton
                          key={rota.caminho}
                          onClick={() => handleSugestaoClick(rota.caminho)}
                        >
                          <ListItemText primary={rota.nome} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                </ClickAwayListener>
              )}
            </Box>
          </Box>

          {/* Notificações e menu usuário */}
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton size="large" color="inherit" aria-label="notificações">
              <NotificationsIcon />
            </IconButton>

            <Tooltip title="Abrir configurações do usuário">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Usuário" src="/avatar.png" />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleCloseUserMenu}>Perfil</MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>Configurações</MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>Sair</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Barra de navegação */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
      >
        <Toolbar sx={{ overflowX: 'auto', gap: 1 }}>
          {rotas.map((rota) => (
            <Button
              key={rota.caminho}
              component={Link}
              to={rota.caminho}
              color={location.pathname === rota.caminho ? 'primary' : 'inherit'}
              variant={location.pathname === rota.caminho ? 'contained' : 'text'}
              sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
            >
              {rota.nome}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      {/* Conteúdo principal */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 5 }}>
        {children}
      </Container>
    </>
  );
}
