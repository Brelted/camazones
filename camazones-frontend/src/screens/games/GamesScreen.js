import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, LoadingDots, Surface, Text } from '../../components/ui';
import { darkPalette, overlay, palette } from '../../theme';

const boardSize = 12;
const initialSnake = [{ x: 5, y: 5 }];
const randomCell = () => ({ x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) });
const gameCatalog = [
  { id: 'snake', label: 'Snake Market', icon: '🐍', text: 'Serpent visible, murs mortels', engine: 'snake' },
  { id: 'fruits', label: 'Fruit Slash', icon: '🍉', text: 'Tape les fruits, evite les bombes', engine: 'fruit' },
  { id: 'ninja', label: 'Ninja Cut', icon: '🥷', text: 'Version rapide facon ninja', engine: 'fruit' },
  { id: 'coins', label: 'Coin Tap', icon: '🪙', text: 'Clique la piece avant le timer', engine: 'tap' },
  { id: 'memory', label: 'Memory Shop', icon: '🧠', text: 'Reflexe et concentration', engine: 'tap' },
  { id: 'runner', label: 'Market Run', icon: '🏃', text: 'Mini challenge vendeur', engine: 'tap' },
];

export default function GamesScreen({ navigation, appSettings }) {
  const [launchedGame, setLaunchedGame] = useState(null);
  const activeGame = gameCatalog.find((game) => game.id === launchedGame);
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.navigate('Seller')} style={[styles.backButton, { borderColor: line, backgroundColor: surface }]}>
            <Text style={[styles.backText, { color: colors.primary }]}>‹ Profil</Text>
          </Pressable>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>MINI JEUX</Text>
          <Text style={[styles.title, { color: colors.text }]}>Choisis puis lance ton jeu</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Clique sur une carte pour demarrer. Les jeux restent legers pour ne pas ralentir Camazones.</Text>
        </View>

        <View style={styles.gameCatalog}>
          {gameCatalog.map((game) => {
            const active = launchedGame === game.id;
            return (
              <Pressable
                key={game.id}
                onPress={() => setLaunchedGame(game.id)}
                style={[styles.gameChip, { backgroundColor: active ? colors.primary : surface, borderColor: active ? colors.primary : line }]}
              >
                <Text style={styles.gameChipIcon}>{game.icon}</Text>
                <Text style={[styles.gameChipTitle, { color: active ? colors.background : colors.text }]}>{game.label}</Text>
                <Text style={[styles.gameChipText, { color: active ? colors.background : muted }]}>{game.text}</Text>
                <Text style={[styles.launchText, { color: active ? colors.background : colors.primary }]}>{active ? 'En cours' : 'Lancer'}</Text>
              </Pressable>
            );
          })}
        </View>

        <Surface style={[styles.gameShell, { backgroundColor: surface, borderColor: line }]}>
          {!activeGame ? (
            <View style={styles.launchState}>
              <LoadingDots color={colors.primary} label="Pret a jouer" />
              <Text style={[styles.gameHint, { color: muted }]}>Selectionne Snake, Fruit Slash ou un mini challenge pour commencer.</Text>
            </View>
          ) : activeGame.engine === 'snake' ? (
            <SnakeGame colors={colors} muted={muted} line={line} darkMode={darkMode} />
          ) : activeGame.engine === 'fruit' ? (
            <FruitSlashGame colors={colors} muted={muted} line={line} darkMode={darkMode} title={activeGame.label} />
          ) : (
            <TapMiniGame colors={colors} muted={muted} line={line} darkMode={darkMode} title={activeGame.label} icon={activeGame.icon} />
          )}
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

function SnakeGame({ colors, muted, line, darkMode }) {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(randomCell());
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!running || gameOver) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSnake((current) => {
        const head = current[0];
        const next = { x: head.x + direction.x, y: head.y + direction.y };
        const outside = next.x < 0 || next.y < 0 || next.x >= boardSize || next.y >= boardSize;
        const hitSelf = current.some((cell) => cell.x === next.x && cell.y === next.y);

        if (outside || hitSelf) {
          setRunning(false);
          setGameOver(true);
          return current;
        }

        const ate = next.x === food.x && next.y === food.y;
        if (ate) {
          setScore((value) => value + 1);
          setFood(randomCell());
          return [next, ...current];
        }

        return [next, ...current.slice(0, -1)];
      });
    }, 230);

    return () => clearInterval(timer);
  }, [direction, food, running, gameOver]);

  const rows = useMemo(() => {
    const snakeCells = new Map(snake.map((cell, index) => [`${cell.x}-${cell.y}`, index]));
    return Array.from({ length: boardSize }, (_, y) =>
      Array.from({ length: boardSize }, (_, x) => {
        const key = `${x}-${y}`;
        return { key, snakeIndex: snakeCells.get(key), food: food.x === x && food.y === y };
      })
    );
  }, [snake, food]);

  const setDir = (x, y) => {
    if (gameOver) {
      return;
    }
    setDirection((current) => (current.x + x === 0 && current.y + y === 0 ? current : { x, y }));
    setRunning(true);
  };

  const reset = () => {
    setSnake(initialSnake);
    setFood(randomCell());
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setRunning(true);
    setGameOver(false);
  };

  return (
    <View style={styles.gameContent}>
      <GameHeader title="Snake Market" score={score} muted={muted} colors={colors} extra={gameOver ? 'Fin de partie: mur touche' : 'Mange la piece, evite les murs'} />
      <View style={[styles.board, { borderColor: gameOver ? palette.orange : line, backgroundColor: darkMode ? palette.dark : overlay.soft }]}>
        {rows.map((row, rowIndex) => (
          <View key={String(rowIndex)} style={styles.boardRow}>
            {row.map((cell) => {
              const isSnake = cell.snakeIndex !== undefined;
              const isHead = cell.snakeIndex === 0;
              return (
                <View
                  key={cell.key}
                  style={[
                    styles.snakeCell,
                    { backgroundColor: darkMode ? palette.darkSurface : palette.card, borderColor: line },
                    isSnake && { backgroundColor: colors.green ?? palette.green },
                    isHead && { backgroundColor: colors.primary, borderColor: palette.text },
                    cell.food && { backgroundColor: colors.orange ?? palette.orange },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
      {gameOver ? (
        <Button compact mode="contained" onPress={reset} buttonColor={colors.primary} textColor={colors.background}>Rejouer</Button>
      ) : (
        <View style={styles.pad}>
          <Button compact mode="outlined" onPress={() => setDir(0, -1)}>Haut</Button>
          <View style={styles.padRow}>
            <Button compact mode="outlined" onPress={() => setDir(-1, 0)}>Gauche</Button>
            <Button compact mode="contained" onPress={() => setRunning((value) => !value)}>{running ? 'Pause' : 'Play'}</Button>
            <Button compact mode="outlined" onPress={() => setDir(1, 0)}>Droite</Button>
          </View>
          <Button compact mode="outlined" onPress={() => setDir(0, 1)}>Bas</Button>
        </View>
      )}
    </View>
  );
}

function FruitSlashGame({ colors, muted, line, darkMode, title }) {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [running, setRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!running || gameOver) {
      return undefined;
    }

    const spawn = setInterval(() => {
      setItems((current) => [
        ...current.slice(-7),
        {
          id: `${Date.now()}-${Math.random()}`,
          x: 8 + Math.random() * 68,
          y: 4,
          type: Math.random() > 0.84 ? 'bomb' : 'fruit',
          label: Math.random() > 0.5 ? '🍉' : '🍍',
        },
      ]);
    }, 620);

    const fall = setInterval(() => {
      setItems((current) => {
        const next = current.map((item) => ({ ...item, y: item.y + 5 }));
        const lost = next.filter((item) => item.y > 84 && item.type === 'fruit').length;
        if (lost) {
          setMissed((value) => {
            const nextMissed = value + lost;
            if (nextMissed >= 3) {
              setRunning(false);
              setGameOver(true);
            }
            return nextMissed;
          });
        }
        return next.filter((item) => item.y <= 84);
      });
    }, 90);

    return () => {
      clearInterval(spawn);
      clearInterval(fall);
    };
  }, [running, gameOver]);

  const reset = () => {
    setItems([]);
    setScore(0);
    setMissed(0);
    setRunning(true);
    setGameOver(false);
  };

  const tapItem = (item) => {
    setItems((current) => current.filter((target) => target.id !== item.id));
    if (item.type === 'bomb') {
      setRunning(false);
      setGameOver(true);
      return;
    }
    setScore((value) => value + 1);
  };

  return (
    <View style={styles.gameContent}>
      <GameHeader title={title} score={score} muted={muted} colors={colors} extra={gameOver ? 'Fin de partie' : `Rates: ${missed}/3`} />
      <View style={[styles.fruitArena, { borderColor: gameOver ? palette.orange : line, backgroundColor: darkMode ? palette.dark : overlay.soft }]}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => tapItem(item)}
            style={[
              styles.fruit,
              {
                left: `${item.x}%`,
                top: `${item.y}%`,
                backgroundColor: item.type === 'bomb' ? palette.dark : colors.orange ?? palette.orange,
                borderColor: item.type === 'bomb' ? colors.orange : colors.green ?? palette.green,
              },
            ]}
          >
            <Text style={styles.fruitText}>{item.type === 'bomb' ? '💣' : item.label}</Text>
          </Pressable>
        ))}
        {!items.length && !gameOver ? (
          <View style={styles.centerHint}>
            <LoadingDots color={colors.primary} label="Preparation" />
          </View>
        ) : null}
      </View>
      {gameOver ? (
        <Button compact mode="contained" onPress={reset} buttonColor={colors.primary} textColor={colors.background}>Rejouer</Button>
      ) : (
        <Button compact mode="outlined" onPress={() => setRunning((value) => !value)}>{running ? 'Pause' : 'Play'}</Button>
      )}
      <Text style={[styles.gameHint, { color: muted }]}>Tous les objets restent dans la zone de jeu. Tape vite, sans sortir du cadre.</Text>
    </View>
  );
}

function TapMiniGame({ colors, muted, line, darkMode, title, icon }) {
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState({ x: 42, y: 42 });
  const moveTarget = () => {
    setScore((value) => value + 1);
    setTarget({ x: 8 + Math.random() * 70, y: 10 + Math.random() * 66 });
  };

  return (
    <View style={styles.gameContent}>
      <GameHeader title={title} score={score} muted={muted} colors={colors} extra="Clique la cible" />
      <View style={[styles.fruitArena, { borderColor: line, backgroundColor: darkMode ? palette.dark : overlay.soft }]}>
        <Pressable
          onPress={moveTarget}
          style={[styles.tapTarget, { left: `${target.x}%`, top: `${target.y}%`, backgroundColor: colors.primary, borderColor: colors.green ?? palette.green }]}
        >
          <Text style={styles.tapTargetText}>{icon}</Text>
        </Pressable>
      </View>
      <Text style={[styles.gameHint, { color: muted }]}>Un mini jeu simple pour lancer vite sans alourdir l'app.</Text>
    </View>
  );
}

function GameHeader({ title, score, muted, colors, extra }) {
  return (
    <View style={styles.gameHeader}>
      <View>
        <Text style={[styles.gameTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.gameHint, { color: muted }]}>{extra ?? 'Score en direct'}</Text>
      </View>
      <View style={[styles.scorePill, { backgroundColor: colors.primary }]}>
        <Text style={[styles.scoreText, { color: colors.background }]}>{score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 112,
    gap: 16,
  },
  header: {
    gap: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  backText: {
    fontWeight: '900',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  gameCatalog: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gameChip: {
    width: '48%',
    minHeight: 126,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    gap: 5,
  },
  gameChipIcon: {
    fontSize: 27,
  },
  gameChipTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  gameChipText: {
    minHeight: 34,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  launchText: {
    marginTop: 'auto',
    fontSize: 12,
    fontWeight: '900',
  },
  gameShell: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
  },
  launchState: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  gameContent: {
    gap: 14,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  gameHint: {
    marginTop: 3,
    lineHeight: 19,
    fontWeight: '700',
  },
  scorePill: {
    minWidth: 54,
    minHeight: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '900',
  },
  board: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 6,
    gap: 3,
  },
  boardRow: {
    flexDirection: 'row',
    gap: 3,
  },
  snakeCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  pad: {
    alignItems: 'center',
    gap: 8,
  },
  padRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fruitArena: {
    height: 340,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  fruit: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fruitText: {
    color: palette.background,
    fontSize: 19,
    lineHeight: 22,
    fontWeight: '900',
  },
  centerHint: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapTarget: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapTargetText: {
    fontSize: 24,
    lineHeight: 28,
  },
});
