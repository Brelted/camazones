import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from '../../components/ui';
import { darkPalette, overlay, palette } from '../../theme';

const boardSize = 12;
const initialSnake = [{ x: 5, y: 5 }];
const randomCell = () => ({ x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) });
const gameCatalog = [
  { id: 'snake', label: 'Snake', icon: '🐍', text: 'Classique rapide' },
  { id: 'fruits', label: 'Fruit Slash', icon: '🍉', text: 'Tape les fruits' },
  { id: 'memory', label: 'Memory', icon: '🧠', text: 'Bientot jouable' },
  { id: 'ninja', label: 'Ninja Cut', icon: '🥷', text: 'Mode arcade' },
  { id: 'runner', label: 'Market Run', icon: '🏃', text: 'Sprint vendeur' },
  { id: 'coins', label: 'Coin Tap', icon: '🪙', text: 'Bonus boutique' },
];

export default function GamesScreen({ appSettings }) {
  const [activeGame, setActiveGame] = useState('snake');
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>MINI JEUX</Text>
          <Text style={[styles.title, { color: colors.text }]}>Pause rapide Camazones</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Deux petits jeux legers pour garder l app vivante sans ralentir le demarrage.</Text>
        </View>

        <View style={styles.gameCatalog}>
          {gameCatalog.map((game) => (
            <Pressable
              key={game.id}
              onPress={() => game.id === 'snake' || game.id === 'fruits' ? setActiveGame(game.id) : null}
              style={[styles.gameChip, { backgroundColor: activeGame === game.id ? colors.primary : surface, borderColor: line }]}
            >
              <Text style={styles.gameChipIcon}>{game.icon}</Text>
              <Text style={[styles.gameChipTitle, { color: activeGame === game.id ? colors.background : colors.text }]}>{game.label}</Text>
              <Text style={[styles.gameChipText, { color: activeGame === game.id ? colors.background : muted }]}>{game.text}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.switcher, { backgroundColor: darkMode ? palette.dark : overlay.soft }]}>
          {gameCatalog.slice(0, 2).map((game) => {
            const active = activeGame === game.id;
            return (
              <Pressable key={game.id} onPress={() => setActiveGame(game.id)} style={[styles.switchButton, active && { backgroundColor: colors.primary }]}>
                <Text style={[styles.switchText, { color: active ? colors.background : colors.text }]}>{game.icon} {game.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Surface style={[styles.gameShell, { backgroundColor: surface, borderColor: line }]}>
          {activeGame === 'snake' ? (
            <SnakeGame colors={colors} muted={muted} line={line} darkMode={darkMode} />
          ) : (
            <FruitSlashGame colors={colors} muted={muted} line={line} darkMode={darkMode} />
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

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSnake((current) => {
        const head = current[0];
        const next = {
          x: (head.x + direction.x + boardSize) % boardSize,
          y: (head.y + direction.y + boardSize) % boardSize,
        };
        const hitSelf = current.some((cell) => cell.x === next.x && cell.y === next.y);
        if (hitSelf) {
          setScore(0);
          setFood(randomCell());
          return initialSnake;
        }

        const ate = next.x === food.x && next.y === food.y;
        if (ate) {
          setScore((value) => value + 1);
          setFood(randomCell());
          return [next, ...current];
        }

        return [next, ...current.slice(0, -1)];
      });
    }, 210);

    return () => clearInterval(timer);
  }, [direction, food, running]);

  const cells = useMemo(() => {
    const snakeCells = new Set(snake.map((cell) => `${cell.x}-${cell.y}`));
    return Array.from({ length: boardSize * boardSize }, (_, index) => {
      const x = index % boardSize;
      const y = Math.floor(index / boardSize);
      const key = `${x}-${y}`;
      return { key, snake: snakeCells.has(key), food: food.x === x && food.y === y };
    });
  }, [snake, food]);

  const setDir = (x, y) => setDirection((current) => (current.x + x === 0 && current.y + y === 0 ? current : { x, y }));

  return (
    <View style={styles.gameContent}>
      <GameHeader title="Snake Market" score={score} muted={muted} colors={colors} />
      <View style={[styles.board, { borderColor: line, backgroundColor: darkMode ? palette.dark : overlay.soft }]}>
        {cells.map((cell) => (
          <View
            key={cell.key}
            style={[
              styles.snakeCell,
              { backgroundColor: darkMode ? palette.darkSurface : palette.card },
              cell.snake && { backgroundColor: colors.green ?? palette.green },
              cell.food && { backgroundColor: colors.orange ?? palette.orange },
            ]}
          />
        ))}
      </View>
      <View style={styles.pad}>
        <Button compact mode="outlined" onPress={() => setDir(0, -1)}>Haut</Button>
        <View style={styles.padRow}>
          <Button compact mode="outlined" onPress={() => setDir(-1, 0)}>Gauche</Button>
          <Button compact mode="contained" onPress={() => setRunning((value) => !value)}>{running ? 'Pause' : 'Play'}</Button>
          <Button compact mode="outlined" onPress={() => setDir(1, 0)}>Droite</Button>
        </View>
        <Button compact mode="outlined" onPress={() => setDir(0, 1)}>Bas</Button>
      </View>
    </View>
  );
}

function FruitSlashGame({ colors, muted, line, darkMode }) {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);

  useEffect(() => {
    const spawn = setInterval(() => {
      setItems((current) => [
        ...current.slice(-8),
        {
          id: `${Date.now()}-${Math.random()}`,
          x: 8 + Math.random() * 74,
          y: 0,
          type: Math.random() > 0.82 ? 'bomb' : 'fruit',
          label: Math.random() > 0.5 ? '🍉' : '🍍',
        },
      ]);
    }, 620);

    const fall = setInterval(() => {
      setItems((current) => {
        const next = current.map((item) => ({ ...item, y: item.y + 7 }));
        const lost = next.filter((item) => item.y > 92 && item.type === 'fruit').length;
        if (lost) {
          setMissed((value) => value + lost);
        }
        return next.filter((item) => item.y <= 102);
      });
    }, 90);

    return () => {
      clearInterval(spawn);
      clearInterval(fall);
    };
  }, []);

  const tapItem = (item) => {
    setItems((current) => current.filter((target) => target.id !== item.id));
    if (item.type === 'bomb') {
      setScore(0);
      setMissed(0);
      return;
    }
    setScore((value) => value + 1);
  };

  return (
    <View style={styles.gameContent}>
      <GameHeader title="Fruit Slash" score={score} muted={muted} colors={colors} extra={`Rates: ${missed}`} />
      <View style={[styles.fruitArena, { borderColor: line, backgroundColor: darkMode ? palette.dark : overlay.soft }]}>
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
      </View>
      <Text style={[styles.gameHint, { color: muted }]}>Tape les fruits, evite les bombes. Partie rapide et legere.</Text>
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
    paddingBottom: 108,
    gap: 16,
  },
  header: {
    gap: 8,
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
  switcher: {
    flexDirection: 'row',
    borderRadius: 18,
    padding: 6,
    gap: 6,
  },
  switchButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 11,
  },
  switchText: {
    fontWeight: '900',
  },
  gameCatalog: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gameChip: {
    width: '48%',
    minHeight: 112,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    gap: 5,
  },
  gameChipIcon: {
    fontSize: 26,
  },
  gameChipTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  gameChipText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
  gameShell: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderRadius: 18,
    padding: 5,
    gap: 3,
  },
  snakeCell: {
    width: `${100 / boardSize - 1}%`,
    aspectRatio: 1,
    borderRadius: 4,
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
    height: 360,
    borderRadius: 20,
    borderWidth: 1,
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
    fontSize: 18,
    fontWeight: '900',
  },
});
