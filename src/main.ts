import Phaser from 'phaser';
import './styles.css';
import labUrl from '../assets/scene1_no_water.png';
import levelTwoUrl from '../assets/scene2.png';
import levelTwoBedAndPersonUrl from '../assets/scene2_bed_and_person.png';
import levelTwoBedStartBurnUrl from '../assets/scene2_bed_start_burn.png';
import levelTwoBedBurningUrl from '../assets/scene2_bed_burning.png';
import levelTwoBedEndBurnUrl from '../assets/scene2_bed_end_burn.png';
import levelThreeTableComputerUrl from '../assets/scene3_table_computer.png';
import levelThreeLaughUrl from '../assets/scene3_laugh.png';
import waterReferenceUrl from '../assets/water_reference.png';
import heroIdleUrl from '../assets/main_character_idle.png';
import heroWalkUrl from '../assets/main_character_walk.png';
import heroDogeUrl from '../assets/main_character_doge_alpha.png';
import heroPortraitUrl from '../assets/main_character_portrait_cutout.png';
import anchorIdleUrl from '../assets/anchor_idle.png';

const WIDTH = 1280;
const HEIGHT = 720;
const LAB_SOURCE_HEIGHT = 941;
const LAB_SCALE = HEIGHT / LAB_SOURCE_HEIGHT;
const LAB_DRY_SOURCE_HEIGHT = 565;
const WATER_SURFACE_Y = Math.round(LAB_SCALE * LAB_DRY_SOURCE_HEIGHT);
const WATER_TEXTURE_Y = WATER_SURFACE_Y;
const GROUND_Y = 526;
const WORLD_WIDTH = 3760;
const WORLD_TILE_COUNT = Math.ceil(WORLD_WIDTH / WIDTH);
const SECOND_LEVEL_TILE_COUNT = 3;
const SECOND_LEVEL_WIDTH = WIDTH * SECOND_LEVEL_TILE_COUNT;
const THIRD_LEVEL_TILE_COUNT = 3;
const THIRD_LEVEL_WIDTH = WIDTH * THIRD_LEVEL_TILE_COUNT;
const THIRD_LEVEL_CENTER_X = WIDTH * 1.5;
const THIRD_LEVEL_PLAYER_START_X = WIDTH * 0.5;
const THIRD_LEVEL_TABLE_Y = 300;
const THIRD_LEVEL_TABLE_WIDTH = 544;
const THIRD_LEVEL_TABLE_HEIGHT = 470;
const THIRD_LEVEL_LIQUID_SURFACE_Y = WATER_SURFACE_Y;
const THIRD_LEVEL_COMPUTER_BIND_X = THIRD_LEVEL_CENTER_X;
const THIRD_LEVEL_COMPUTER_BIND_Y = 336;
const THIRD_LEVEL_COMPUTER_ANCHOR_DROP_X = THIRD_LEVEL_CENTER_X;
const THIRD_LEVEL_COMPUTER_ANCHOR_DROP_Y = GROUND_Y - 36;
const SECOND_LEVEL_BED_SCALE = 0.45;
const SECOND_LEVEL_BED_BURNING_SCALE = SECOND_LEVEL_BED_SCALE;
const SECOND_LEVEL_BED_FRAME_SIZE = 960;
const MAIN_CHARACTER_PORTRAIT_WIDTH = 372;
const MAIN_CHARACTER_PORTRAIT_HEIGHT = 660;
const SECOND_LEVEL_BED_X = WIDTH * 1.67;
const SECOND_LEVEL_BED_Y = HEIGHT / 2;
const SECOND_LEVEL_BED_REFLECTION_Y = WATER_SURFACE_Y + 50;
const SECOND_LEVEL_BED_REFLECTION_ALPHA = 0.42;
const SECOND_LEVEL_BURN_DURATION_MS = 3600;
const SECOND_LEVEL_POST_BURN_HORROR_DURATION_MS = 1300;
const SECOND_LEVEL_EXIT_X = SECOND_LEVEL_WIDTH - 155;
const SECOND_LEVEL_SUBJECT_INTERACT_RANGE = 360;
const SECOND_LEVEL_SUBJECT_BIND_X = SECOND_LEVEL_BED_X - 92;
const SECOND_LEVEL_SUBJECT_BIND_Y = SECOND_LEVEL_BED_Y - 36;
const SECOND_LEVEL_SUBJECT_ANCHOR_DROP_X = SECOND_LEVEL_BED_X - 72;
const SECOND_LEVEL_SUBJECT_ANCHOR_DROP_Y = GROUND_Y - 36;
const EXIT_DOOR_X = WORLD_WIDTH - 155;
const EXIT_DOOR_Y = GROUND_Y - 150;
const EXIT_DOOR_WIDTH = 210;
const EXIT_DOOR_HEIGHT = 300;
const EXIT_INTERACT_RANGE = 210;
const PLAYER_IDLE_SCALE = 0.35;
const PLAYER_WALK_SCALE_X = 0.36;
const PLAYER_WALK_SCALE_Y = 0.36;
const PLAYER_SPEED = 200;
const PLAYER_CARRY_SPEED = 200;
const PLAYER_TETHERED_SPEED = 200;
const SECOND_LEVEL_PLAYER_SPEED = 200;
const WAVE_WASH_PUSH = -760;
const WAVE_ANCHORED_PUSH = -260;
const CURRENT_DURATION = 5000;
const FIRST_CURRENT_DELAY = 6400;
const CURRENT_COOLDOWN = 9800;
const CURRENT_SURGE_TRAVEL = WIDTH + 340;
const CURRENT_RISE_START = 0;
const CURRENT_RISE_END = 0.46;
const CURRENT_FALL_START = 0.78;
const CURRENT_FALL_END = 1;
const LEG_SPLASH_OFFSETS = [-17, 18];
const ANCHOR_IDLE_FRAME_WIDTH = 1536;
const ANCHOR_IDLE_FRAME_HEIGHT = 1024;
const ANCHOR_SPRITE_WIDTH = 184;
const ANCHOR_SPRITE_HEIGHT = 124;
// Rendered behind the translucent water tiles (depth 32) but in front of the
// opaque waterBase (depth 31), so the grounded anchor reads as submerged.
const ANCHOR_SUBMERGED_DEPTH = 31.5;
const ANCHOR_UNDERWATER_SILHOUETTE_DEPTH = 35.4;
// Carried anchor keeps its grounded size and is gripped directly in the holder's hand.
const ANCHOR_CARRY_SCALE = 0.68;
const ANCHOR_CARRY_DEPTH = 34.6;
// Per-frame grip point in source-frame pixel space (0..1024). The anchor sits here so
// it tracks the hand through the idle/walk animation (and flips to the facing side
// automatically). Tune each frame with DEBUG_HAND_MARKER on until the dot sits on the hand.
const PLAYER_HAND_MARKERS: Record<string, { x: number; y: number }[]> = {
  'player-idle': Array.from({ length: 6 }, () => ({ x: 300, y: 500 })),
  // Starter per-frame grip points for the walk cycle (arm swing around {400,550}).
  // These are estimates — refine each frame with DEBUG_HAND_MARKER on.
  'player-walk': [{ x: 340, y: 500 }],
  'player-doge': [{ x: 600, y: 420 }],
};
const DEBUG_HAND_MARKER = false;
const TETHER_LENGTH = 190;
const TETHER_SOFT_ZONE = 0.62;
const ANCHOR_HOOK_ROTATION_MAX = 0.92;
const ANCHOR_HOOK_ROTATION_IDLE = 0.12;
const ANKLE_TIE_Y = GROUND_Y - 16;
const IDLE_ORIGIN = { x: 494, y: 946 };
const WALK_ORIGIN = { x: 494, y: 950 };
const DOGE_ORIGIN = { x: 500, y: 911 };
const PLAYER_DOGE_SCALE = 0.38;
const FREEZE_CHARACTER_TRANSLATION_FOR_ANIM_CHECK = false;
const SCREEN_VIGNETTE_TEXTURE_KEY = 'screen-vignette';
const PLAYER_BACKLIGHT_LAYERS = [
  { width: 340, height: 410, alpha: 0.055, y: -178 },
  { width: 250, height: 320, alpha: 0.08, y: -184 },
  { width: 155, height: 230, alpha: 0.105, y: -194 },
];
const SCENE_HOTKEY_COOLDOWN_MS = 350;
const SCENE_AUDIO_FADE_OUT_MS = 650;
const PROLOGUE_FADE_OUT_MS = 1200;
const FIRST_LEVEL_FADE_IN_MS = 5000;
const FINAL_SCREEN_HOLD_MS = 3000;
const SCENE3_CRT_SWITCH_DURATION_MS = 3000;
const SCENE3_GLITCH_ART_DURATION_MS = 1300;
const SCENE3_LAUGH_START_DELAY_MS = SCENE3_CRT_SWITCH_DURATION_MS + SCENE3_GLITCH_ART_DURATION_MS;
const SCENE3_LAUGH_STICKER_DURATION_MS = 15000;
const AUDIO_KEYS = [
  'amb_menu',
  'amb_water_lab',
  'amb_blood_lab',
  'amb_black_room',
  'amb_laugh_noise',
  'type_key',
  'voice_researcher',
  'voice_player',
  'voice_dclass',
  'ui_next',
  'ui_confirm',
  'ui_cancel',
  'ui_popup',
  'step_water',
  'step_blood',
  'step_black',
  'anchor_sway',
  'anchor_drop_water',
  'anchor_drop_blood',
  'anchor_drop_black',
  'anchor_tension',
  'anchor_bind',
  'anchor_retrieve',
  'door',
  'door_open',
  'test_complete',
  'horror_hit',
  'incinerator_start',
  'fire_loop',
  'ash_fall',
  'crt_switch',
  'glitch_burst',
  'glitch_loop',
  'laugh_hit',
  'sticker_slap',
  'final_pulse',
  'wave',
  'start_enter',
] as const;
const AUDIO_FALLBACK_EXTENSION = 'wav';
const AUDIO_PREFERRED_EXTENSION = 'mp3';
const SHARED_AMBIENCE_AUDIO_KEY = 'amb';
const SHARED_ANCHOR_DROP_AUDIO_KEY = 'anchor_drop';

let sceneHotkeysLockedUntil = 0;
let activeMusic: Phaser.Sound.BaseSound | null = null;

type AudioKey = (typeof AUDIO_KEYS)[number];

function getAudioAssetUrl(fileName: string) {
  return `${import.meta.env.BASE_URL}audio/${fileName}`;
}

function getAudioUrl(key: AudioKey) {
  if (key.startsWith('amb_')) {
    const sharedPreferredUrl = getAudioAssetUrl(`${SHARED_AMBIENCE_AUDIO_KEY}.${AUDIO_PREFERRED_EXTENSION}`);
    const sharedFallbackUrl = getAudioAssetUrl(`${SHARED_AMBIENCE_AUDIO_KEY}.${AUDIO_FALLBACK_EXTENSION}`);
    const sharedUrl = getExistingAudioUrl(sharedPreferredUrl, sharedFallbackUrl, false);
    if (sharedUrl) {
      return sharedUrl;
    }
  }

  if (key.startsWith('anchor_drop_')) {
    const sharedPreferredUrl = getAudioAssetUrl(`${SHARED_ANCHOR_DROP_AUDIO_KEY}.${AUDIO_PREFERRED_EXTENSION}`);
    const sharedFallbackUrl = getAudioAssetUrl(`${SHARED_ANCHOR_DROP_AUDIO_KEY}.${AUDIO_FALLBACK_EXTENSION}`);
    const sharedUrl = getExistingAudioUrl(sharedPreferredUrl, sharedFallbackUrl, false);
    if (sharedUrl) {
      return sharedUrl;
    }
  }

  const preferredUrl = getAudioAssetUrl(`${key}.${AUDIO_PREFERRED_EXTENSION}`);
  const fallbackUrl = getAudioAssetUrl(`${key}.${AUDIO_FALLBACK_EXTENSION}`);
  return getExistingAudioUrl(preferredUrl, fallbackUrl, true) ?? fallbackUrl;
}

function getExistingAudioUrl(preferredUrl: string, fallbackUrl: string, useFallbackWithoutChecking: boolean) {
  if (typeof XMLHttpRequest === 'undefined') {
    return fallbackUrl;
  }

  if (audioUrlExists(preferredUrl)) {
    return preferredUrl;
  }

  if (useFallbackWithoutChecking || audioUrlExists(fallbackUrl)) {
    return fallbackUrl;
  }

  return null;
}

function audioUrlExists(url: string) {
  try {
    const request = new XMLHttpRequest();
    request.open('HEAD', url, false);
    request.send();

    if (request.status < 200 || request.status >= 300) {
      return false;
    }

    const contentType = request.getResponseHeader('content-type')?.toLowerCase() ?? '';
    return contentType.startsWith('audio/');
  } catch {
    return false;
  }
}

type LevelNumber = 1 | 2 | 3;

type GameKeyMap = Record<
  | 'a'
  | 'd'
  | 'e'
  | 'space'
  | 'r'
  | 'one'
  | 'two'
  | 'three'
  | 'numpadOne'
  | 'numpadTwo'
  | 'numpadThree',
  Phaser.Input.Keyboard.Key
>;

function loadGameAssets(scene: Phaser.Scene) {
  if (!scene.textures.exists('lab')) {
    scene.load.image('lab', labUrl);
  }
  if (!scene.textures.exists('lab2')) {
    scene.load.image('lab2', levelTwoUrl);
  }
  if (!scene.textures.exists('lab2-bed-and-person')) {
    scene.load.image('lab2-bed-and-person', levelTwoBedAndPersonUrl);
  }
  if (!scene.textures.exists('lab2-bed-start-burn')) {
    scene.load.spritesheet('lab2-bed-start-burn', levelTwoBedStartBurnUrl, {
      frameWidth: SECOND_LEVEL_BED_FRAME_SIZE,
      frameHeight: SECOND_LEVEL_BED_FRAME_SIZE,
    });
  }
  if (!scene.textures.exists('lab2-bed-burning')) {
    scene.load.spritesheet('lab2-bed-burning', levelTwoBedBurningUrl, {
      frameWidth: SECOND_LEVEL_BED_FRAME_SIZE,
      frameHeight: SECOND_LEVEL_BED_FRAME_SIZE,
    });
  }
  if (!scene.textures.exists('lab2-bed-end-burn')) {
    scene.load.spritesheet('lab2-bed-end-burn', levelTwoBedEndBurnUrl, {
      frameWidth: SECOND_LEVEL_BED_FRAME_SIZE,
      frameHeight: SECOND_LEVEL_BED_FRAME_SIZE,
    });
  }
  if (!scene.textures.exists('scene3-table-computer')) {
    scene.load.image('scene3-table-computer', levelThreeTableComputerUrl);
  }
  if (!scene.textures.exists('scene3-laugh')) {
    scene.load.image('scene3-laugh', levelThreeLaughUrl);
  }
  if (!scene.textures.exists('water-reference')) {
    scene.load.image('water-reference', waterReferenceUrl);
  }
  if (!scene.textures.exists('anchor-idle')) {
    scene.load.spritesheet('anchor-idle', anchorIdleUrl, {
      frameWidth: ANCHOR_IDLE_FRAME_WIDTH,
      frameHeight: ANCHOR_IDLE_FRAME_HEIGHT,
    });
  }
  if (!scene.textures.exists('hero-idle')) {
    scene.load.spritesheet('hero-idle', heroIdleUrl, {
      frameWidth: 1024,
      frameHeight: 1024,
    });
  }
  if (!scene.textures.exists('hero-walk')) {
    scene.load.spritesheet('hero-walk', heroWalkUrl, {
      frameWidth: 1024,
      frameHeight: 1024,
    });
  }
  if (!scene.textures.exists('hero-doge')) {
    scene.load.spritesheet('hero-doge', heroDogeUrl, {
      frameWidth: 1024,
      frameHeight: 1024,
    });
  }
  if (!scene.textures.exists('main-character-portrait')) {
    scene.load.image('main-character-portrait', heroPortraitUrl);
  }

  AUDIO_KEYS.forEach((key) => {
    if (!scene.cache.audio.exists(key)) {
      scene.load.audio(key, getAudioUrl(key));
    }
  });
}

function ensureCoreAnimations(scene: Phaser.Scene) {
  if (!scene.anims.exists('player-idle')) {
    scene.anims.create({
      key: 'player-idle',
      frames: scene.anims.generateFrameNumbers('hero-idle', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: -1,
    });
  }

  if (!scene.anims.exists('player-walk')) {
    scene.anims.create({
      key: 'player-walk',
      frames: scene.anims.generateFrameNumbers('hero-walk', { start: 0, end: 6 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  if (!scene.anims.exists('player-doge')) {
    scene.anims.create({
      key: 'player-doge',
      frames: scene.anims.generateFrameNumbers('hero-doge', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1,
    });
  }

  if (!scene.anims.exists('anchor-idle')) {
    scene.anims.create({
      key: 'anchor-idle',
      frames: scene.anims.generateFrameNumbers('anchor-idle', { start: 0, end: 5 }),
      frameRate: 6,
      repeat: -1,
    });
  }
}

function hasAudio(scene: Phaser.Scene, key: AudioKey) {
  return scene.cache.audio.exists(key);
}

function playSfx(scene: Phaser.Scene, key: AudioKey, volume = 0.5, config: Phaser.Types.Sound.SoundConfig = {}) {
  if (!hasAudio(scene, key)) return;

  scene.sound.play(key, {
    volume,
    ...config,
  });
}

const throttledSfxTimes = new WeakMap<Phaser.Scene, Map<AudioKey, number>>();
const loopingSfx = new WeakMap<Phaser.Scene, Map<AudioKey, Phaser.Sound.BaseSound>>();
const audioFadingScenes = new WeakSet<Phaser.Scene>();

function playThrottledSfx(
  scene: Phaser.Scene,
  key: AudioKey,
  volume: number,
  intervalMs: number,
  config: Phaser.Types.Sound.SoundConfig = {},
) {
  const sceneTimes = throttledSfxTimes.get(scene) ?? new Map<AudioKey, number>();
  throttledSfxTimes.set(scene, sceneTimes);

  const lastPlayedAt = sceneTimes.get(key) ?? -Number.POSITIVE_INFINITY;
  if (scene.time.now - lastPlayedAt < intervalMs) return;

  sceneTimes.set(key, scene.time.now);
  playSfx(scene, key, volume, config);
}

function setLoopingSfx(
  scene: Phaser.Scene,
  key: AudioKey,
  active: boolean,
  volume: number,
  config: Phaser.Types.Sound.SoundConfig = {},
) {
  if (audioFadingScenes.has(scene)) return;

  const sceneLoops = loopingSfx.get(scene) ?? new Map<AudioKey, Phaser.Sound.BaseSound>();
  loopingSfx.set(scene, sceneLoops);

  const current = sceneLoops.get(key);
  if (!active) {
    if (current) {
      current.stop();
      current.destroy();
      sceneLoops.delete(key);
    }
    return;
  }

  if (current) {
    (current as Phaser.Sound.BaseSound & { setVolume: (value: number) => Phaser.Sound.BaseSound }).setVolume(volume);
    return;
  }

  if (!hasAudio(scene, key)) return;

  const sound = scene.sound.add(key, {
    loop: true,
    volume,
    ...config,
  });
  sceneLoops.set(key, sound);
  sound.play();
}

function stopLoopingSfxForScene(scene: Phaser.Scene) {
  const sceneLoops = loopingSfx.get(scene);
  if (!sceneLoops) return;

  sceneLoops.forEach((sound) => {
    sound.stop();
    sound.destroy();
  });
  sceneLoops.clear();
}

function playMusic(scene: Phaser.Scene, key: AudioKey, volume = 0.35) {
  if (!hasAudio(scene, key)) return;

  if (activeMusic) {
    activeMusic.stop();
    activeMusic.destroy();
    activeMusic = null;
  }

  activeMusic = scene.sound.add(key, { loop: true, volume });
  activeMusic.play();
}

function stopMusic() {
  if (!activeMusic) return;

  activeMusic.stop();
  activeMusic.destroy();
  activeMusic = null;
}

function stopAllSceneAudio(scene: Phaser.Scene) {
  stopLoopingSfxForScene(scene);
  scene.sound.stopAll();
  if (activeMusic) {
    activeMusic.destroy();
    activeMusic = null;
  }
}

function getSoundVolume(sound: Phaser.Sound.BaseSound) {
  return typeof (sound as Phaser.Sound.BaseSound & { volume?: number }).volume === 'number'
    ? ((sound as Phaser.Sound.BaseSound & { volume: number }).volume)
    : 1;
}

function setSoundVolume(sound: Phaser.Sound.BaseSound, volume: number) {
  const volumeSound = sound as Phaser.Sound.BaseSound & { setVolume?: (value: number) => Phaser.Sound.BaseSound };
  volumeSound.setVolume?.(Phaser.Math.Clamp(volume, 0, 1));
}

function destroySceneSounds(scene: Phaser.Scene, sounds: Phaser.Sound.BaseSound[]) {
  sounds.forEach((sound) => {
    if (sound.pendingRemove) return;

    sound.stop();
    sound.destroy();
  });
  loopingSfx.get(scene)?.clear();
  scene.sound.stopAll();
  activeMusic = null;
}

function fadeOutSceneAudio(scene: Phaser.Scene, duration: number, onComplete: () => void) {
  audioFadingScenes.add(scene);
  const soundManager = scene.sound as Phaser.Sound.BaseSoundManager & { sounds?: Phaser.Sound.BaseSound[] };
  const sounds = [...(soundManager.sounds ?? [])].filter((sound) => !sound.pendingRemove);
  if (sounds.length === 0) {
    stopAllSceneAudio(scene);
    audioFadingScenes.delete(scene);
    onComplete();
    return;
  }

  const trackedSounds = sounds.map((sound) => ({
    sound,
    volume: getSoundVolume(sound),
  }));
  const fadeState = { progress: 1 };

  scene.tweens.add({
    targets: fadeState,
    progress: 0,
    duration,
    ease: 'Sine.easeOut',
    onUpdate: () => {
      trackedSounds.forEach(({ sound, volume }) => {
        if (!sound.pendingRemove) {
          setSoundVolume(sound, volume * fadeState.progress);
        }
      });
    },
    onComplete: () => {
      destroySceneSounds(scene, sounds);
      audioFadingScenes.delete(scene);
      onComplete();
    },
  });
}

function getDialogueVoiceKey(line: DialogueLine): AudioKey {
  if (line.speaker.includes('D-')) return 'voice_dclass';
  if (line.speaker.includes('鎿嶄綔') || line.portrait === 'player') return 'voice_player';
  if (line.speaker.includes('旁白') || line.speaker.includes('绯荤粺') || line.speaker.includes('記錄')) {
    return 'type_key';
  }

  return 'voice_researcher';
}

function playDialogueVoice(scene: Phaser.Scene, line: DialogueLine) {
  const key = getDialogueVoiceKey(line);
  const baseVolume = key === 'type_key' ? 0.12 : key === 'voice_dclass' ? 0.28 : 0.2;
  const textUnits = Array.from(line.text).length;
  const tickCount = Phaser.Math.Clamp(Math.ceil(textUnits / 8), 2, 18);

  for (let i = 0; i < tickCount; i += 1) {
    scene.time.delayedCall(i * 44, () => {
      const detune = Phaser.Math.Between(-90, 90);
      playSfx(scene, key, baseVolume, { detune });
    });
  }
}

function createGameKeyMap(scene: Phaser.Scene): GameKeyMap {
  const keyboard = scene.input.keyboard;
  if (!keyboard) {
    throw new Error('Keyboard input is required for this prototype.');
  }

  keyboard.resetKeys();

  return {
    a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
    d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    e: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    space: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    r: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
    one: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
    two: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
    three: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
    numpadOne: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE),
    numpadTwo: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO),
    numpadThree: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE),
  };
}

function isJustDown(...keys: Phaser.Input.Keyboard.Key[]) {
  return keys.some((key) => Phaser.Input.Keyboard.JustDown(key));
}

function isSceneHotkeyCoolingDown() {
  return Date.now() < sceneHotkeysLockedUntil;
}

function hasNavigationKeyDown(keys: GameKeyMap) {
  return [
    keys.r,
    keys.one,
    keys.two,
    keys.three,
    keys.numpadOne,
    keys.numpadTwo,
    keys.numpadThree,
  ].some((key) => key.isDown);
}

function startGameScene(scene: Phaser.Scene, sceneKey: string, data?: object) {
  sceneHotkeysLockedUntil = Date.now() + SCENE_HOTKEY_COOLDOWN_MS;
  scene.input.keyboard?.resetKeys();
  fadeOutSceneAudio(scene, SCENE_AUDIO_FADE_OUT_MS, () => {
    scene.scene.start(sceneKey, data);
  });
}

function startLevel(scene: Phaser.Scene, level: LevelNumber) {
  const targetScene = level === 1 ? 'ExploreScene' : level === 2 ? 'SecondLevelScene' : 'ThirdLevelScene';
  startGameScene(scene, targetScene);
}

function startPrologue(scene: Phaser.Scene) {
  startGameScene(scene, 'PrologueScene');
}

function navigateByLevelHotkey(scene: Phaser.Scene, keys: GameKeyMap) {
  if (isSceneHotkeyCoolingDown()) {
    if (hasNavigationKeyDown(keys)) {
      scene.input.keyboard?.resetKeys();
    }
    return false;
  }

  if (isJustDown(keys.r)) {
    startGameScene(scene, 'StartMenuScene');
    return true;
  }

  if (isJustDown(keys.one, keys.numpadOne)) {
    startLevel(scene, 1);
    return true;
  }

  if (isJustDown(keys.two, keys.numpadTwo)) {
    startLevel(scene, 2);
    return true;
  }

  if (isJustDown(keys.three, keys.numpadThree)) {
    startLevel(scene, 3);
    return true;
  }

  return false;
}

type AnchorCarrier = 'floor' | 'player' | 'npc';
type RippleShape = 'short' | 'broken' | 'thread' | 'swell';

interface RippleLayer {
  bands: number;
  yStart: number;
  bandGap: number;
  color: number;
  lineWidth: number;
  alpha: number;
  currentAlpha: number;
  spacing: number;
  spacingJitter: number;
  length: number;
  lengthJitter: number;
  driftSpeed: number;
  yWave: number;
  bend: number;
  shape: RippleShape;
}

interface DialogueLine {
  speaker: string;
  text: string;
  portrait?: 'player';
}

type SecondLevelPhase =
  | 'intro'
  | 'approachSubject'
  | 'readyToBind'
  | 'bindingAnchor'
  | 'readyToIncinerate'
  | 'incinerating'
  | 'askSubject'
  | 'recoverAnchor'
  | 'reclaimingAnchor'
  | 'reportResult'
  | 'exitOpen';

type ThirdLevelPhase = 'intro' | 'readyToBind' | 'bindingAnchor' | 'readyToOperate' | 'confirm' | 'glitch' | 'ending';

const SURFACE_RIPPLE_LAYERS: RippleLayer[] = [
  {
    bands: 4,
    yStart: WATER_SURFACE_Y + 12,
    bandGap: 22,
    color: 0xe2f6f0,
    lineWidth: 0.7,
    alpha: 0.26,
    currentAlpha: 0.38,
    spacing: 150,
    spacingJitter: 42,
    length: 20,
    lengthJitter: 36,
    driftSpeed: 2,
    yWave: 1.4,
    bend: 1.2,
    shape: 'short',
  },
  {
    bands: 5,
    yStart: WATER_SURFACE_Y + 48,
    bandGap: 36,
    color: 0x9bc4c5,
    lineWidth: 1,
    alpha: 0.18,
    currentAlpha: 0.28,
    spacing: 245,
    spacingJitter: 72,
    length: 58,
    lengthJitter: 70,
    driftSpeed: -11,
    yWave: 2.4,
    bend: 2.2,
    shape: 'thread',
  },
  {
    bands: 3,
    yStart: WATER_SURFACE_Y + 105,
    bandGap: 58,
    color: 0x5f8d94,
    lineWidth: 1.4,
    alpha: 0.12,
    currentAlpha: 0.18,
    spacing: 330,
    spacingJitter: 110,
    length: 96,
    lengthJitter: 92,
    driftSpeed: -5,
    yWave: 3.2,
    bend: 3.4,
    shape: 'swell',
  },
];

const FOREGROUND_RIPPLE_LAYERS: RippleLayer[] = [
  {
    bands: 3,
    yStart: GROUND_Y + 12,
    bandGap: 30,
    color: 0xc0d8d4,
    lineWidth: 0.8,
    alpha: 0.13,
    currentAlpha: 0.22,
    spacing: 210,
    spacingJitter: 58,
    length: 42,
    lengthJitter: 50,
    driftSpeed: -12,
    yWave: 3.6,
    bend: 2,
    shape: 'broken',
  },
  {
    bands: 2,
    yStart: GROUND_Y + 82,
    bandGap: 48,
    color: 0x83aeb1,
    lineWidth: 1.2,
    alpha: 0.09,
    currentAlpha: 0.15,
    spacing: 320,
    spacingJitter: 90,
    length: 92,
    lengthJitter: 88,
    driftSpeed: -7,
    yWave: 4.2,
    bend: 3,
    shape: 'swell',
  },
];

const BLOOD_SURFACE_RIPPLE_LAYERS: RippleLayer[] = [
  {
    bands: 2,
    yStart: WATER_SURFACE_Y + 14,
    bandGap: 32,
    color: 0xff9a86,
    lineWidth: 1.5,
    alpha: 0.2,
    currentAlpha: 0.28,
    spacing: 360,
    spacingJitter: 130,
    length: 56,
    lengthJitter: 72,
    driftSpeed: 1.2,
    yWave: 2.4,
    bend: 2.4,
    shape: 'broken',
  },
  {
    bands: 2,
    yStart: WATER_SURFACE_Y + 58,
    bandGap: 44,
    color: 0xc24a43,
    lineWidth: 2.1,
    alpha: 0.13,
    currentAlpha: 0.2,
    spacing: 520,
    spacingJitter: 180,
    length: 116,
    lengthJitter: 128,
    driftSpeed: -5,
    yWave: 3.6,
    bend: 4.2,
    shape: 'swell',
  },
  {
    bands: 2,
    yStart: WATER_SURFACE_Y + 132,
    bandGap: 72,
    color: 0x742126,
    lineWidth: 2.7,
    alpha: 0.08,
    currentAlpha: 0.14,
    spacing: 700,
    spacingJitter: 230,
    length: 210,
    lengthJitter: 170,
    driftSpeed: -2.8,
    yWave: 5.4,
    bend: 6.2,
    shape: 'swell',
  },
];

const BLOOD_FOREGROUND_RIPPLE_LAYERS: RippleLayer[] = [
  {
    bands: 2,
    yStart: GROUND_Y + 12,
    bandGap: 36,
    color: 0xd06b60,
    lineWidth: 1.4,
    alpha: 0.12,
    currentAlpha: 0.19,
    spacing: 460,
    spacingJitter: 160,
    length: 86,
    lengthJitter: 96,
    driftSpeed: -5.6,
    yWave: 4.4,
    bend: 3.6,
    shape: 'broken',
  },
  {
    bands: 1,
    yStart: GROUND_Y + 82,
    bandGap: 56,
    color: 0x8d3031,
    lineWidth: 2.2,
    alpha: 0.08,
    currentAlpha: 0.13,
    spacing: 720,
    spacingJitter: 220,
    length: 170,
    lengthJitter: 142,
    driftSpeed: -3.4,
    yWave: 5.2,
    bend: 5.8,
    shape: 'swell',
  },
];

class StartMenuScene extends Phaser.Scene {
  private keys!: GameKeyMap;

  constructor() {
    super('StartMenuScene');
  }

  preload() {
    loadGameAssets(this);
  }

  create() {
    ensureCoreAnimations(this);
    this.keys = createGameKeyMap(this);
    playMusic(this, 'amb_menu', 0.26);
    playSfx(this, 'start_enter', 0.58);

    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x000000);

    this.add
      .text(WIDTH / 2, HEIGHT / 2 - 96, 'scp-anchor', {
        fontFamily: 'monospace',
        fontSize: '72px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setDepth(30);

    this.add
      .text(WIDTH / 2, HEIGHT / 2 + 38, '开始游戏', {
        fontFamily: 'monospace',
        fontSize: '25px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setDepth(30);

    const startText = this.children.list[this.children.list.length - 1] as Phaser.GameObjects.Text;
    this.tweens.add({
      targets: startText,
      alpha: 0.1,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add
      .zone(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    this.input.on('pointerdown', () => {
      playSfx(this, 'ui_confirm', 0.34);
      startPrologue(this);
    });

    this.cameras.main.fadeIn(360, 0, 0, 0);
  }

  update() {
    if (navigateByLevelHotkey(this, this.keys)) return;
    if (isJustDown(this.keys.e, this.keys.space)) {
      playSfx(this, 'ui_confirm', 0.34);
      startPrologue(this);
    }
  }
}

class PrologueScene extends Phaser.Scene {
  private keys!: GameKeyMap;
  private bodyText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private lineIndex = 0;
  private isLeaving = false;
  private readonly lines = [
    '你是基金会站点内的现场操作员。你的工作不是研究异常，而是在研究员下达指令后，亲手把异常带到指定的位置。',
    '今天的对象被登记为 SCP-Anchor。它看起来像一枚旧式船锚，但真正被固定的不是金属本身，而是“位置”这个概念。',
    '只要 SCP-Anchor 与某种介质建立连接，它就会把连接者拉回被锚定的坐标。水、血液、组织液，甚至更复杂的载体，都在今天的测试列表里。',
    '研究部门想确认一件事：当人体、介质和 SCP-Anchor 同时成为系统的一部分时，被锁住的是身体，意识，还是某个更深的东西。',
    '你被选中作为操作员，不是因为你更了解它，而是因为你足够稳定，能按步骤放下、回收、转移，并在每一次异常反应后继续执行。',
    '记录开始。保持通讯。握紧 SCP-Anchor。第一项测试即将进行。',
  ];

  constructor() {
    super('PrologueScene');
  }

  create() {
    this.lineIndex = 0;
    this.isLeaving = false;
    this.keys = createGameKeyMap(this);
    playMusic(this, 'amb_black_room', 0.2);
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x000000);

    this.bodyText = this.add
      .text(WIDTH / 2, HEIGHT / 2 - 20, '', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 12,
        wordWrap: { width: 760, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.hintText = this.add
      .text(WIDTH / 2, HEIGHT - 86, '点击 / E / Space 继续', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.input.on('pointerdown', () => this.advanceLine());
    this.cameras.main.fadeIn(280, 0, 0, 0);
    this.renderLine();
  }

  update() {
    if (this.isLeaving) return;
    if (navigateByLevelHotkey(this, this.keys)) return;
    if (isJustDown(this.keys.e, this.keys.space)) {
      this.advanceLine();
    }
  }

  private renderLine() {
    this.bodyText.setText(this.wrapPrologueLine(this.lines[this.lineIndex] ?? ''));
    playDialogueVoice(this, { speaker: '旁白', text: this.lines[this.lineIndex] ?? '' });
    this.hintText.setText(this.lineIndex === this.lines.length - 1 ? '点击 / E / Space 开始测试' : '点击 / E / Space 继续');
  }

  private wrapPrologueLine(text: string) {
    const maxUnits = 44;
    const lines: string[] = [];
    let current = '';
    let currentUnits = 0;
    let lastBreakIndex = -1;

    for (const char of text) {
      const units = char.charCodeAt(0) > 255 ? 2 : 1;
      current += char;
      currentUnits += units;

      if ('，。；：、？！,.!?;: '.includes(char)) {
        lastBreakIndex = current.length;
      }

      if (currentUnits > maxUnits) {
        const breakIndex = lastBreakIndex > 0 ? lastBreakIndex : current.length;
        const line = current.slice(0, breakIndex).trim();
        if (line.length > 0) {
          lines.push(line);
        }

        current = current.slice(breakIndex).trimStart();
        currentUnits = this.measureTextUnits(current);
        lastBreakIndex = -1;
      }
    }

    if (current.trim().length > 0) {
      lines.push(current.trim());
    }

    return lines.join('\n');
  }

  private measureTextUnits(text: string) {
    let units = 0;
    for (const char of text) {
      units += char.charCodeAt(0) > 255 ? 2 : 1;
    }
    return units;
  }

  private advanceLine() {
    if (this.isLeaving) return;

    this.lineIndex += 1;
    if (this.lineIndex < this.lines.length) {
      playSfx(this, 'ui_next', 0.2);
      this.renderLine();
      return;
    }

    this.isLeaving = true;
    playSfx(this, 'ui_confirm', 0.3);
    this.cameras.main.fadeOut(PROLOGUE_FADE_OUT_MS, 0, 0, 0);
    this.time.delayedCall(PROLOGUE_FADE_OUT_MS, () => {
      startGameScene(this, 'ExploreScene', { fadeInFromPrologue: true });
    });
  }
}

class ExploreScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private npc!: Phaser.Physics.Arcade.Sprite;
  private anchor!: Phaser.GameObjects.Container;
  private anchorRope!: Phaser.GameObjects.Graphics;
  private anchorGlowBack!: Phaser.GameObjects.Ellipse;
  private anchorGlowCore!: Phaser.GameObjects.Ellipse;
  private anchorSilhouette!: Phaser.GameObjects.Sprite;
  private anchorRimGlow: Phaser.Filters.Glow | null = null;
  private anchorDebug!: Phaser.GameObjects.Graphics;
  private waterBase!: Phaser.GameObjects.Graphics;
  private waterTiles: Phaser.GameObjects.Image[] = [];
  private waterBack!: Phaser.GameObjects.Graphics;
  private waterReflection!: Phaser.GameObjects.Graphics;
  private waterSurface!: Phaser.GameObjects.Graphics;
  private waterFront!: Phaser.GameObjects.Graphics;
  private promptText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private objectiveText!: Phaser.GameObjects.Text;
  private waterText!: Phaser.GameObjects.Text;
  private completionText!: Phaser.GameObjects.Text;
  private transitionOverlay!: Phaser.GameObjects.Rectangle;
  private dialoguePanel!: Phaser.GameObjects.Container;
  private dialogueBackground!: Phaser.GameObjects.Rectangle;
  private dialoguePortrait!: Phaser.GameObjects.Image;
  private dialogueSpeakerText!: Phaser.GameObjects.Text;
  private dialogueBodyText!: Phaser.GameObjects.Text;
  private dialogueHintText!: Phaser.GameObjects.Text;
  private playerBackLights: Phaser.GameObjects.Ellipse[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: GameKeyMap;
  private carrier: AnchorCarrier = 'player';
  private tetherConnected = true;
  private facing = 1;
  private currentActive = false;
  private currentIntensity = 0;
  private currentStartedAt = -Number.POSITIVE_INFINITY;
  private currentEndsAt = 0;
  private nextCurrentAt = Number.POSITIVE_INFINITY;
  private currentsUnlocked = false;
  private currentFrontStartX = WIDTH + 150;
  private lastWaterUpdateTime: number | null = null;
  private waterPhase = 0;
  private tilePhase = 0;
  private reflectionPhase = 0;
  private ripplePhase = 0;
  private wakePhase = 0;
  private legSplashPhase = 0;
  private playerMoveInput = 0;
  private playerWaterSpeed = 0;
  private dialogueLines: DialogueLine[] = [];
  private dialogueIndex = 0;
  private dialogueActive = false;
  private dialogueInputConsumed = false;
  private npcTargetX: number | null = null;
  private lastPlayerAnim = '';
  private playerWorldX = 260;
  private npcWorldX = 1680;
  private isChangingLevel = false;
  private introFadeActive = false;

  constructor() {
    super('ExploreScene');
  }

  preload() {
    loadGameAssets(this);
  }

  create(data?: { fadeInFromPrologue?: boolean }) {
    this.resetSceneState();
    this.resetCurrentSchedule();
    this.createWorld();
    this.createAnimations();
    this.createActors();
    this.createFocusLighting();
    this.createAnchor();
    this.createProceduralWater();
    this.createHud();
    this.createControls();
    playMusic(this, 'amb_water_lab', 0.28);

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, HEIGHT);
    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.cameras.main.roundPixels = true;
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, HEIGHT);

    if (data?.fadeInFromPrologue) {
      this.playFirstLevelIntroFade();
    } else {
      this.startOpeningDialogue();
    }
  }

  private playFirstLevelIntroFade() {
    this.introFadeActive = true;
    const introFade = this.add
      .rectangle(0, 0, WIDTH, HEIGHT, 0x000000, 1)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1000);

    this.tweens.add({
      targets: introFade,
      alpha: 0,
      duration: FIRST_LEVEL_FADE_IN_MS,
      ease: 'Quad.easeIn',
      onComplete: () => {
        introFade.destroy();
        this.introFadeActive = false;
        this.startOpeningDialogue();
      },
    });
  }

  private resetSceneState() {
    this.carrier = 'player';
    this.tetherConnected = true;
    this.facing = 1;
    this.playerMoveInput = 0;
    this.playerWaterSpeed = 0;
    this.dialogueLines = [];
    this.dialogueIndex = 0;
    this.dialogueActive = false;
    this.dialogueInputConsumed = false;
    this.npcTargetX = null;
    this.lastPlayerAnim = '';
    this.playerWorldX = 260;
    this.npcWorldX = 1680;
    this.isChangingLevel = false;
    this.introFadeActive = false;
  }

  private resetCurrentSchedule() {
    this.currentActive = false;
    this.currentIntensity = 0;
    this.currentStartedAt = -Number.POSITIVE_INFINITY;
    this.currentEndsAt = 0;
    this.nextCurrentAt = Number.POSITIVE_INFINITY;
    this.currentsUnlocked = false;
    this.currentFrontStartX = WIDTH + 150;
    this.lastWaterUpdateTime = null;
  }

  update(time: number, delta: number) {
    this.dialogueInputConsumed = false;
    this.updateDialogueInput();
    this.handleLevelHotkeys();
    this.updateCurrent(time);
    this.updatePlayer(delta);
    this.updateNpc(delta);
    this.updateFocusLighting(time);
    this.updateAnchor();
    this.updatePrompt();
    this.updateHud(time);
  }

  private createWorld() {
    this.add.rectangle(WORLD_WIDTH / 2, HEIGHT / 2, WORLD_WIDTH, HEIGHT, 0x04070a);

    for (let i = 0; i < WORLD_TILE_COUNT; i += 1) {
      const bg = this.add.image(i * WIDTH, 0, 'lab').setOrigin(0, 0).setScale(LAB_SCALE);
      bg.setAlpha(0.88);
      bg.setTint(i === 1 ? 0xb7c8d0 : 0xffffff);
    }

    const exit = this.add.rectangle(
      EXIT_DOOR_X,
      EXIT_DOOR_Y,
      EXIT_DOOR_WIDTH,
      EXIT_DOOR_HEIGHT,
      0x07100f,
      0.8,
    );
    exit.setStrokeStyle(2, 0x84e2d8, 0.32);
  }

  private createAnimations() {
    ensureCoreAnimations(this);
  }

  private createActors() {
    this.player = this.physics.add.sprite(260, GROUND_Y, 'hero-idle', 0);
    this.playerWorldX = this.player.x;
    this.applyCharacterPose(this.player, 'player-idle');
    this.player.setDepth(30);
    this.player.setCollideWorldBounds(true);
    this.player.body?.setSize(160, 360);
    this.player.play('player-idle');

    this.npc = this.physics.add.sprite(1680, GROUND_Y, 'hero-idle', 5);
    this.npcWorldX = this.npc.x;
    this.applyCharacterPose(this.npc, 'player-idle');
    this.npc.setDepth(28);
    this.npc.setVisible(false);
    this.npc.setActive(false);
    this.npc.play('player-idle');
  }

  private createAnchor() {
    this.anchorRope = this.add.graphics().setDepth(37.2);
    this.anchorDebug = this.add.graphics().setDepth(200);
    this.anchor = this.add.container(430, GROUND_Y - 36).setDepth(ANCHOR_SUBMERGED_DEPTH);

    this.anchorGlowBack = this.add
      .ellipse(this.anchor.x, this.anchor.y + 6, 190, 96, 0x5eeeff, 0.14)
      .setDepth(34)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.anchorGlowCore = this.add
      .ellipse(this.anchor.x, this.anchor.y + 4, 88, 42, 0xd8ffff, 0.09)
      .setDepth(37)
      .setBlendMode(Phaser.BlendModes.ADD);

    const sprite = this.add
      .sprite(0, 44, 'anchor-idle', 0)
      .setOrigin(0.5, 0.82)
      .setDisplaySize(ANCHOR_SPRITE_WIDTH, ANCHOR_SPRITE_HEIGHT);
    sprite.play('anchor-idle');

    this.anchorSilhouette = this.add
      .sprite(this.anchor.x, this.anchor.y + 44, 'anchor-idle', 0)
      .setOrigin(0.5, 0.82)
      .setDisplaySize(ANCHOR_SPRITE_WIDTH, ANCHOR_SPRITE_HEIGHT)
      .setTint(0x8cd8dc)
      .setAlpha(0)
      .setDepth(ANCHOR_UNDERWATER_SILHOUETTE_DEPTH)
      .setBlendMode(Phaser.BlendModes.SCREEN)
      .setVisible(false);
    this.anchorSilhouette.play('anchor-idle');

    // Subtle silhouette-following rim light (轮廓光) on the anchor.
    const spriteFilters = sprite.enableFilters().filters;
    if (spriteFilters) {
      this.anchorRimGlow = spriteFilters.internal.addGlow(0xbff4ff, 2, 0, 1, false, 10, 14);
    }

    this.anchor.add(sprite);
    this.updateAnchorGlow();
  }

  private createProceduralWater() {
    this.waterBase = this.add.graphics().setDepth(31);

    this.waterTiles = [];
    for (let i = 0; i < WORLD_TILE_COUNT; i += 1) {
      const tile = this.add
        .image(i * WIDTH, WATER_TEXTURE_Y, 'water-reference')
        .setOrigin(0, 0)
        .setScale(LAB_SCALE)
        .setDepth(32);

      this.waterTiles.push(tile);
    }

    this.waterBack = this.add.graphics().setDepth(33);
    this.waterReflection = this.add.graphics().setDepth(34);
    this.waterSurface = this.add.graphics().setDepth(35);
    this.waterFront = this.add.graphics().setDepth(36);
    this.updateProceduralWater(0);
  }

  private createHud() {
    this.statusText = this.add
      .text(26, 24, '', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#d4e4e8',
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.objectiveText = this.add
      .text(26, 52, '', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#87adb6',
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.waterText = this.add
      .text(WIDTH - 230, 24, '', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#9be7f4',
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.promptText = this.add
      .text(WIDTH / 2, HEIGHT - 82, '', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#d7f1f4',
        backgroundColor: 'rgba(5, 12, 14, 0.72)',
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(100);

    this.transitionOverlay = this.add
      .rectangle(0, 0, WIDTH, HEIGHT, 0x000000, 1)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(139)
      .setAlpha(0)
      .setVisible(false);

    this.completionText = this.add
      .text(WIDTH / 2, HEIGHT / 2 - 48, '', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#e6fbff',
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(140)
      .setVisible(false);

    this.createDialoguePanel();
  }

  private createDialoguePanel() {
    const panel = this.add.container(WIDTH / 2, HEIGHT - 96).setScrollFactor(0).setDepth(130).setVisible(false);
    this.dialogueBackground = this.add.rectangle(0, 0, 980, 166, 0x050b0e, 0.92);
    this.dialogueBackground.setStrokeStyle(1, 0x7bd4db, 0.34);

    this.dialoguePortrait = this.add
      .image(-438, 120, 'main-character-portrait')
      .setDisplaySize(MAIN_CHARACTER_PORTRAIT_WIDTH, MAIN_CHARACTER_PORTRAIT_HEIGHT)
      .setOrigin(0.5, 1)
      .setVisible(false);

    this.dialogueSpeakerText = this.add
      .text(-416, -58, '', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#d9fbff',
      })
      .setOrigin(0, 0);

    this.dialogueBodyText = this.add
      .text(-416, -25, '', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#b7d2d7',
        wordWrap: { width: 832 },
        lineSpacing: 7,
      })
      .setOrigin(0, 0);

    this.dialogueHintText = this.add
      .text(416, 52, 'E / Space 继续', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#6f9eaa',
      })
      .setOrigin(1, 0);

    panel.add([
      this.dialogueBackground,
      this.dialoguePortrait,
      this.dialogueSpeakerText,
      this.dialogueBodyText,
      this.dialogueHintText,
    ]);
    this.dialoguePanel = panel;
  }

  private createControls() {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input is required for this prototype.');
    }

    this.cursors = keyboard.createCursorKeys();
    this.keys = createGameKeyMap(this);
  }

  private startOpeningDialogue() {
    this.dialogueLines = [
      {
        speaker: '研究员 / 水介质测试室',
        text: 'D-██，听得到吗？你手上的是 SCP-Anchor。保持握持，不要把它举出水面太久。',
      },
      {
        speaker: '操作员',
        text: '收到，研究员。SCP-Anchor 已经在手上。',
        portrait: 'player',
      },
      {
        speaker: '研究员 / 水介质测试室',
        text: '本次第一阶段测试目标：确认 SCP-Anchor 的基本能力。在媒介为水的情况下，它是否能锚定活体的位置。',
      },
      {
        speaker: '研究员 / 水介质测试室',
        text: '只要脚下仍是液体环境，你就可以随时放下 SCP-Anchor；需要移动时，再把它取回。',
      },
      {
        speaker: '研究员 / 水介质测试室',
        text: '水流会周期性冲击测试室。若 SCP-Anchor 与水媒介建立连接，你的“位置”应该比身体本身更难被带走。',
      },
      {
        speaker: '研究员 / 水介质测试室',
        text: '如果听到链条拖行声，不要回头。那只是锚在寻找可固定的东西。现在，向右侧出口前进。',
      },
      {
        speaker: '操作员',
        text: '好的，开始行动。',
        portrait: 'player',
      }
    ];
    this.dialogueIndex = 0;
    this.dialogueActive = this.dialogueLines.length > 0;
    this.dialoguePanel.setVisible(this.dialogueActive);
    if (!this.dialogueActive) {
      this.unlockCurrents();
      return;
    }

    this.renderDialogueLine();
  }

  private updateDialogueInput() {
    if (!this.dialogueActive) return;

    const advancePressed =
      Phaser.Input.Keyboard.JustDown(this.keys.e) || Phaser.Input.Keyboard.JustDown(this.keys.space);
    if (!advancePressed) return;

    this.dialogueInputConsumed = true;
    playSfx(this, 'ui_next', 0.18);
    this.dialogueIndex += 1;

    if (this.dialogueIndex >= this.dialogueLines.length) {
      this.finishOpeningDialogue();
      return;
    }

    this.renderDialogueLine();
  }

  private finishOpeningDialogue() {
    this.dialogueActive = false;
    this.dialoguePanel.setVisible(false);
    this.unlockCurrents();
  }

  private unlockCurrents() {
    if (this.currentsUnlocked) return;

    this.currentsUnlocked = true;
    this.currentActive = false;
    this.currentIntensity = 0;
    this.nextCurrentAt = this.time.now + FIRST_CURRENT_DELAY;
  }

  private renderDialogueLine() {
    const line = this.dialogueLines[this.dialogueIndex];
    if (!line) return;

    const showPortrait = line.portrait === 'player' || line.speaker === '操作员';
    const isInnerThought = line.speaker.includes('内心');
    this.dialoguePortrait.setVisible(showPortrait);
    this.dialogueBackground
      .setPosition(showPortrait ? 112 : 0, showPortrait ? 14 : 0)
      .setSize(showPortrait ? 900 : 980, showPortrait ? 154 : 166)
      .setFillStyle(showPortrait ? 0x071015 : 0x050b0e, showPortrait ? 0.86 : 0.92);
    this.dialogueBackground.setStrokeStyle(1, showPortrait ? 0x9ac3c9 : 0x7bd4db, showPortrait ? 0.28 : 0.34);
    this.dialogueSpeakerText.setX(showPortrait ? -282 : -436);
    this.dialogueSpeakerText.setY(showPortrait ? -42 : -62);
    this.dialogueBodyText.setX(showPortrait ? -282 : -436);
    this.dialogueBodyText.setY(showPortrait ? -4 : -28);
    this.dialogueBodyText.setWordWrapWidth(showPortrait ? 790 : 872);
    this.dialogueHintText.setX(showPortrait ? 520 : 436);
    this.dialogueHintText.setY(showPortrait ? 58 : 56);
    this.dialogueSpeakerText.setColor(isInnerThought ? '#e6f9ff' : '#d9fbff');
    this.dialogueBodyText.setColor(isInnerThought ? '#cde6ed' : '#b7d2d7');
    this.dialogueSpeakerText.setText(line.speaker);
    this.dialogueBodyText.setText(line.text);
    playDialogueVoice(this, line);
    this.dialogueHintText.setText(
      this.dialogueIndex === this.dialogueLines.length - 1 ? 'E / Space 结束' : 'E / Space 继续',
    );
  }

  private handleLevelHotkeys() {
    navigateByLevelHotkey(this, this.keys);
  }

  private updatePlayer(delta: number) {
    const previousPlayerWorldX = this.playerWorldX;
    let move = 0;
    if (this.cursors.left?.isDown || this.keys.a.isDown) move -= 1;
    if (this.cursors.right?.isDown || this.keys.d.isDown) move += 1;
    const controlsLocked = this.dialogueActive || this.introFadeActive || this.isChangingLevel;
    if (controlsLocked) move = 0;

    let tetherState = this.getAnchorTetherState(this.playerWorldX);
    const isTethered = tetherState.grounded;
    const wavePressure = controlsLocked ? 0 : this.getWavePressureOnPlayer(this.playerWorldX);
    const isWaveLocked = !controlsLocked && wavePressure > 0.06;
    let velocityX = 0;

    if (!FREEZE_CHARACTER_TRANSLATION_FOR_ANIM_CHECK) {
      const deltaSeconds = Math.min(delta, 50) / 1000;
      const speed = this.carrier === 'player' ? PLAYER_CARRY_SPEED : PLAYER_SPEED;
      const controlledMove = isWaveLocked ? 0 : move;
      velocityX = controlledMove * speed;

      if (wavePressure > 0) {
        const anchorResistance = isTethered ? Phaser.Math.Linear(0.12, 0.96, tetherState.tension) : 0;
        const currentPush = isTethered ? WAVE_ANCHORED_PUSH : WAVE_WASH_PUSH;
        velocityX += currentPush * wavePressure * (1 - anchorResistance);
      }

      if (isTethered) {
        this.constrainPlayerByAnchorTether();
        tetherState = this.getAnchorTetherState(this.playerWorldX);
        velocityX = Phaser.Math.Clamp(velocityX, -PLAYER_TETHERED_SPEED, PLAYER_TETHERED_SPEED);
        if (tetherState.tension > 0.64 && Math.abs(move) > 0) {
          playThrottledSfx(this, 'anchor_tension', 0.18, 520, {
            detune: Phaser.Math.Between(-80, 40),
          });
        }
      }

      this.playerWorldX += velocityX * deltaSeconds;

      if (isTethered) {
        this.constrainPlayerByAnchorTether();
      }
    }

    this.player.setVelocity(0, 0);
    this.player.y = GROUND_Y;

    if (isWaveLocked) {
      this.facing = 1;
      this.player.setFlipX(false);
      if (isTethered) {
        this.setPlayerAnim('player-idle');
      } else {
        this.setPlayerAnim('player-doge');
      }
    } else if (move !== 0) {
      this.facing = move > 0 ? 1 : -1;
      this.player.setFlipX(this.facing < 0);
      this.setPlayerAnim('player-walk');
    } else {
      this.setPlayerAnim('player-idle');
    }

    this.handleInteractionInput();
    if (!FREEZE_CHARACTER_TRANSLATION_FOR_ANIM_CHECK) {
      const cameraLeft = this.cameras.main.scrollX;
      if (this.playerWorldX < cameraLeft + 58) {
        this.playerWorldX = Math.ceil(cameraLeft + 58);
      }

      if (delta > 0 && this.currentActive && !isTethered && this.playerWorldX < 95) {
        this.playerWorldX = 95;
      }

      this.playerWorldX = Phaser.Math.Clamp(this.playerWorldX, 58, WORLD_WIDTH - 58);
      this.player.x = Math.round(this.playerWorldX);
    } else {
      this.playerWorldX = this.player.x;
    }

    const deltaSeconds = Math.max(Math.min(delta, 50) / 1000, 0.001);
    this.playerMoveInput = move;
    this.playerWaterSpeed = Math.abs(this.playerWorldX - previousPlayerWorldX) / deltaSeconds;
  }

  private setPlayerAnim(key: string) {
    if (this.lastPlayerAnim === key) return;
    this.player.play(key, true);
    this.applyCharacterPose(this.player, key);
    this.lastPlayerAnim = key;
  }


  private handleInteractionInput() {
    if (this.isChangingLevel || this.dialogueActive || this.dialogueInputConsumed || this.introFadeActive) return;

    const pressedExit = Phaser.Input.Keyboard.JustDown(this.keys.e);
    const pressedInteract = pressedExit || Phaser.Input.Keyboard.JustDown(this.keys.space);
    if (!pressedInteract) return;

    if (pressedExit && this.isAtExitDoor()) {
      this.enterNextLevel();
      return;
    }

    if (this.carrier === 'floor' && this.distanceTo(this.anchor.x, this.anchor.y) < 120) {
      this.carrier = 'player';
      this.tetherConnected = true;
      playSfx(this, 'anchor_retrieve', 0.42);
      return;
    }

    if (this.carrier === 'player') {
      this.carrier = 'floor';
      const dropDirection = this.currentActive ? 1 : this.facing;
      this.anchor.x = Phaser.Math.Clamp(this.player.x + dropDirection * 76, 40, WORLD_WIDTH - 40);
      this.anchor.y = GROUND_Y - 36;
      playSfx(this, 'anchor_drop_water', 0.5);
    }
  }

  private isAtExitDoor() {
    return Math.abs(this.playerWorldX - EXIT_DOOR_X) <= EXIT_INTERACT_RANGE;
  }

  private enterNextLevel() {
    this.isChangingLevel = true;
    this.promptText.setVisible(false);
    this.transitionOverlay.setAlpha(0).setVisible(true);
    playSfx(this, 'test_complete', 0.42);
    playSfx(this, 'door', 0.42, { delay: 0.24 });
    this.tweens.add({
      targets: this.transitionOverlay,
      alpha: 1,
      duration: 420,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.completionText.setText('水介质锚定测试完成').setVisible(true);
        this.time.delayedCall(1050, () => {
          startGameScene(this, 'SecondLevelScene', { fromCompletionTransition: true });
        });
      },
    });
  }

  private updateNpc(delta: number) {
    if (this.carrier !== 'npc' || this.npcTargetX === null) {
      this.npc.setVelocity(0, 0);
      this.npcWorldX = this.npc.x;
      return;
    }

    if (FREEZE_CHARACTER_TRANSLATION_FOR_ANIM_CHECK) {
      this.npc.setVelocity(0, 0);
      this.npc.play('player-walk', true);
      this.applyCharacterPose(this.npc, 'player-walk');
      return;
    }

    const deltaSeconds = Math.min(delta, 50) / 1000;
    const direction = Math.sign(this.npcTargetX - this.npcWorldX);
    this.npc.setVelocity(0, 0);
    this.npc.play('player-walk', true);
    this.applyCharacterPose(this.npc, 'player-walk');
    this.npc.setFlipX(direction < 0);

    this.npcWorldX += direction * 135 * deltaSeconds;
    this.npc.x = Math.round(this.npcWorldX);

    if (Math.abs(this.npcTargetX - this.npcWorldX) < 12 || delta <= 0) {
      this.npcWorldX = this.npcTargetX;
      this.npc.x = Math.round(this.npcWorldX);
      this.npcTargetX = null;
      this.npc.setVelocity(0, 0);
      this.npc.play('player-idle', true);
      this.applyCharacterPose(this.npc, 'player-idle');
      this.carrier = 'floor';
      this.anchor.x = this.npc.x + 64;
      this.anchor.y = GROUND_Y - 36;
    }
  }

  private applyCharacterPose(sprite: Phaser.GameObjects.Sprite, animKey: string) {
    const isWalking = animKey === 'player-walk';
    const isWaveLocked = animKey === 'player-doge';
    const origin = isWaveLocked ? DOGE_ORIGIN : isWalking ? WALK_ORIGIN : IDLE_ORIGIN;
    sprite.setDisplayOrigin(origin.x, origin.y);
    if (isWalking) {
      sprite.setScale(PLAYER_WALK_SCALE_X, PLAYER_WALK_SCALE_Y);
    } else {
      sprite.setScale(isWaveLocked ? PLAYER_DOGE_SCALE : PLAYER_IDLE_SCALE);
    }
  }

  private createFocusLighting() {
    this.playerBackLights = PLAYER_BACKLIGHT_LAYERS.map((layer) =>
      this.add
        .ellipse(this.player.x, GROUND_Y + layer.y, layer.width, layer.height, 0xb8edff, layer.alpha)
        .setDepth(27)
        .setBlendMode(Phaser.BlendModes.ADD),
    );

    this.createScreenVignetteTexture();
    this.add
      .image(0, 0, SCREEN_VIGNETTE_TEXTURE_KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(90);

    this.updateFocusLighting(0);
  }

  private updateFocusLighting(time: number) {
    const t = time * 0.001;
    const x = Math.round(this.player.x);
    const pulse = 1 + Math.sin(t * 2.1) * 0.025 + Math.sin(t * 5.7) * 0.012;

    this.playerBackLights.forEach((light, index) => {
      const layer = PLAYER_BACKLIGHT_LAYERS[index];
      light.setPosition(x, Math.round(GROUND_Y + layer.y));
      light.setScale(pulse, pulse);
      light.setAlpha(layer.alpha * (1 + this.currentIntensity * 0.18));
    });
  }

  private createScreenVignetteTexture() {
    if (this.textures.exists(SCREEN_VIGNETTE_TEXTURE_KEY)) return;

    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context is required for the screen vignette.');
    }

    const gradient = context.createRadialGradient(
      WIDTH * 0.5,
      HEIGHT * 0.48,
      HEIGHT * 0.42,
      WIDTH * 0.5,
      HEIGHT * 0.5,
      WIDTH * 0.62,
    );

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.58, 'rgba(0, 0, 0, 0.02)');
    gradient.addColorStop(0.82, 'rgba(0, 0, 0, 0.16)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.34)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    this.textures.addCanvas(SCREEN_VIGNETTE_TEXTURE_KEY, canvas);
  }

  private updateAnchor() {
    this.anchorRope.clear();
    this.anchorDebug.clear();
    const ankle = this.getPlayerAnklePoint(this.player.x);

    if (this.carrier === 'player') {
      this.updateCarriedAnchor(this.player, this.lastPlayerAnim || 'player-idle', this.playerMoveInput !== 0);
      return;
    }

    if (this.carrier === 'npc') {
      const npcAnim = this.npcTargetX !== null ? 'player-walk' : 'player-idle';
      this.updateCarriedAnchor(this.npc, npcAnim, this.npcTargetX !== null);
      return;
    }

    this.anchor.setDepth(ANCHOR_SUBMERGED_DEPTH);
    this.anchor.setScale(0.68);
    if (this.tetherConnected) {
      const tether = this.getAnchorTetherState(this.playerWorldX);
      const pullDirection = Math.sign(ankle.x - this.anchor.x) || this.facing;
      this.anchor.setRotation(this.getAnchoredHookRotation(pullDirection, tether.tension, this.waterPhase));
      const ring = this.getAnchorRingPoint();
      this.drawHingeRope(ankle.x, ankle.y, ring.x, ring.y, tether.tension, 0.68);
    } else {
      this.anchor.setRotation(Math.sin(this.waterPhase * 1.4 + this.anchor.x * 0.01) * ANCHOR_HOOK_ROTATION_IDLE);
    }
    this.updateAnchorGlow();
  }

  // Anchor carried at full size, gripped directly in the holder's hand (no chain).
  private updateCarriedAnchor(holder: Phaser.GameObjects.Sprite, animKey: string, moving: boolean) {
    this.anchor.setDepth(ANCHOR_CARRY_DEPTH);

    const hand = this.getCarrierHandPoint(holder, animKey);

    const t = this.waterPhase;
    const swayX = moving ? Math.sin(t * 6) * 3 : Math.sin(t * 1.6) * 2;

    this.anchor.setScale(ANCHOR_CARRY_SCALE);
    this.anchor.x = hand.x + swayX;
    // The anchor's ring (handle) sits right in the hand; the body hangs just below the grip.
    this.anchor.y = hand.y + 54 * ANCHOR_CARRY_SCALE;
    this.anchor.setRotation(swayX * 0.006);

    this.updateAnchorGlow();

    if (DEBUG_HAND_MARKER) {
      this.anchorDebug
        .lineStyle(2, 0xff3b6b, 1)
        .strokeCircle(hand.x, hand.y, 6)
        .lineStyle(2, 0xffffff, 0.9)
        .lineBetween(hand.x - 9, hand.y, hand.x + 9, hand.y)
        .lineBetween(hand.x, hand.y - 9, hand.x, hand.y + 9);
    }
  }

  // Resolve the per-frame hand marker to a world-space attachment point on the holder.
  private getCarrierHandPoint(sprite: Phaser.GameObjects.Sprite, animKey: string) {
    const markers = PLAYER_HAND_MARKERS[animKey] ?? PLAYER_HAND_MARKERS['player-idle'];
    const frameIndex = sprite.anims.currentFrame ? sprite.anims.currentFrame.index : 0;
    const safeIndex = ((frameIndex % markers.length) + markers.length) % markers.length;
    const marker = markers[safeIndex];
    const dir = sprite.flipX ? -1 : 1;

    return {
      x: sprite.x + (marker.x - sprite.displayOriginX) * sprite.scaleX * dir,
      y: sprite.y + (marker.y - sprite.displayOriginY) * sprite.scaleY,
    };
  }

  private updateAnchorGlow() {
    const submerged = Phaser.Math.Clamp((this.anchor.y - WATER_SURFACE_Y + 56) / 120, 0, 1);
    const carriedFade = this.carrier === 'player' || this.carrier === 'npc' ? 0.16 : 1;
    const pulse = 0.82 + Math.sin(this.waterPhase * 2.1 + this.anchor.x * 0.012) * 0.18;
    const glow = submerged * carriedFade * pulse;
    const visible = glow > 0.025;

    this.anchorGlowBack.setVisible(false).setAlpha(0);
    this.anchorGlowCore.setVisible(false).setAlpha(0);

    const silhouetteVisible = this.carrier === 'floor' && submerged > 0.18;
    const distortionX = Math.sin(this.waterPhase * 3.2 + this.anchor.x * 0.018) * 4;
    this.anchorSilhouette
      .setVisible(silhouetteVisible)
      .setPosition(this.anchor.x + distortionX, this.anchor.y + 44 * this.anchor.scaleY)
      .setDisplaySize(
        ANCHOR_SPRITE_WIDTH * this.anchor.scaleX * 1.08,
        ANCHOR_SPRITE_HEIGHT * this.anchor.scaleY * 0.92,
      )
      .setRotation(this.anchor.rotation + Math.sin(this.waterPhase * 2.4) * 0.015)
      .setAlpha(silhouetteVisible ? Phaser.Math.Linear(0.16, 0.34, submerged) * pulse : 0);

    // Rim light only while the anchor is in the water; fades out when carried above the surface.
    if (this.anchorRimGlow) {
      const rimVisible = this.carrier === 'floor' && visible;
      this.anchorRimGlow.active = rimVisible;
      if (rimVisible) {
        this.anchorRimGlow.outerStrength = 1.4 + glow * 3.4;
      }
    }
  }

  private getPlayerAnklePoint(playerX = this.player.x) {
    return {
      x: playerX + this.facing * 8,
      y: ANKLE_TIE_Y,
    };
  }

  private getAnchorRingPoint() {
    const localX = 0;
    const localY = -54 * this.anchor.scaleY;
    const rotation = this.anchor.rotation;
    return {
      x: this.anchor.x + localX * Math.cos(rotation) - localY * Math.sin(rotation),
      y: this.anchor.y + localX * Math.sin(rotation) + localY * Math.cos(rotation),
    };
  }

  private getAnchoredHookRotation(pullDirection: number, tension: number, phase: number) {
    const direction = pullDirection >= 0 ? 1 : -1;
    const bite = Phaser.Math.SmoothStep(tension, 0, 1);
    const idleRock = Math.sin(phase * 1.6 + this.anchor.x * 0.01) * ANCHOR_HOOK_ROTATION_IDLE * (1 - bite);
    return direction * Phaser.Math.Linear(ANCHOR_HOOK_ROTATION_IDLE, ANCHOR_HOOK_ROTATION_MAX, bite) + idleRock;
  }

  private isAnchorGrounded() {
    return this.tetherConnected && this.carrier === 'floor';
  }

  private getAnchorTetherState(playerX = this.playerWorldX) {
    if (!this.isAnchorGrounded()) {
      return { grounded: false, distance: 0, tension: 0 };
    }

    const ankle = this.getPlayerAnklePoint(playerX);
    const anchorX = this.anchor.x;
    const distance = Math.abs(ankle.x - anchorX);
    const tensionStart = TETHER_LENGTH * TETHER_SOFT_ZONE;
    const tension = Phaser.Math.Clamp((distance - tensionStart) / (TETHER_LENGTH - tensionStart), 0, 1);

    return { grounded: true, distance, tension };
  }

  private constrainPlayerByAnchorTether() {
    if (!this.isAnchorGrounded()) return;

    const footOffset = this.facing * 8;
    const anchorX = this.anchor.x;
    const minX = anchorX - TETHER_LENGTH - footOffset;
    const maxX = anchorX + TETHER_LENGTH - footOffset;
    this.playerWorldX = Phaser.Math.Clamp(this.playerWorldX, minX, maxX);
  }

  private drawHingeRope(x1: number, y1: number, x2: number, y2: number, tension: number, alpha: number) {
    const slack = 1 - tension;
    const midX = (x1 + x2) * 0.5;
    const midY = (y1 + y2) * 0.5 + slack * 26;
    const lineAlpha = alpha * Phaser.Math.Linear(0.52, 1, tension);
    const lineWidth = Phaser.Math.Linear(2, 3.4, tension);

    this.anchorRope.lineStyle(lineWidth + 2, 0x04151b, lineAlpha * 0.42);
    this.anchorRope.beginPath();
    this.anchorRope.moveTo(x1, y1);
    this.anchorRope.lineTo(midX, midY + 2);
    this.anchorRope.lineTo(x2, y2);
    this.anchorRope.strokePath();

    this.anchorRope.lineStyle(lineWidth, tension > 0.55 ? 0xbff8ff : 0x91b8c1, lineAlpha);
    this.anchorRope.beginPath();
    this.anchorRope.moveTo(x1, y1);
    this.anchorRope.lineTo(midX, midY);
    this.anchorRope.lineTo(x2, y2);
    this.anchorRope.strokePath();

    this.drawRopeHinge(x1, y1, x2, y2, tension, 5.4, 0x9fc5c9, 0xd8ffff);
    this.drawRopeHinge(x2, y2, x1, y1, tension, 7.2, 0x9fc5c9, 0xd8ffff);
  }

  private drawRopeHinge(
    x: number,
    y: number,
    towardX: number,
    towardY: number,
    tension: number,
    radius: number,
    metalColor: number,
    highlightColor: number,
  ) {
    const angle = Phaser.Math.Angle.Between(x, y, towardX, towardY);
    const alpha = 0.36 + tension * 0.44;
    const lugLength = radius * 1.25;
    const lugWidth = Phaser.Math.Clamp(radius * 0.46, 2.4, 3.6);
    const lugEndX = x + Math.cos(angle) * lugLength;
    const lugEndY = y + Math.sin(angle) * lugLength;

    this.anchorRope.lineStyle(lugWidth + 2, 0x031014, alpha * 0.55);
    this.anchorRope.lineBetween(x, y, lugEndX, lugEndY);
    this.anchorRope.lineStyle(lugWidth, metalColor, alpha);
    this.anchorRope.lineBetween(x, y, lugEndX, lugEndY);

    this.anchorRope.fillStyle(0x031014, alpha * 0.5);
    this.anchorRope.fillCircle(x + 1.5, y + 2, radius + 2.4);
    this.anchorRope.fillStyle(0x1a3035, alpha * 0.82);
    this.anchorRope.fillCircle(x, y, radius + 1.4);
    this.anchorRope.lineStyle(1.4, metalColor, alpha);
    this.anchorRope.strokeCircle(x, y, radius + 1.4);
    this.anchorRope.fillStyle(0x061417, 0.72);
    this.anchorRope.fillCircle(x, y, radius * 0.46);

    this.anchorRope.lineStyle(1, highlightColor, 0.22 + tension * 0.36);
    this.anchorRope.beginPath();
    this.anchorRope.arc(x - radius * 0.24, y - radius * 0.28, radius * 0.72, Math.PI * 1.05, Math.PI * 1.72, false);
    this.anchorRope.strokePath();

    this.anchorRope.fillStyle(highlightColor, 0.28 + tension * 0.18);
    this.anchorRope.fillCircle(x - radius * 0.28, y - radius * 0.34, Math.max(1, radius * 0.18));
  }

  private updateCurrent(time: number) {
    if (!this.currentsUnlocked) {
      this.currentActive = false;
      this.currentIntensity = 0;
      this.updateProceduralWater(time);
      return;
    }

    if (!this.currentActive && time >= this.nextCurrentAt) {
      this.currentActive = true;
      this.currentStartedAt = time;
      this.currentEndsAt = time + CURRENT_DURATION;
      this.nextCurrentAt = time + CURRENT_COOLDOWN;
      this.currentFrontStartX = this.cameras.main.scrollX + WIDTH + 150;
      playSfx(this, 'wave', 0.58);
    }

    if (this.currentActive && time >= this.currentEndsAt) {
      this.currentActive = false;
    }

    this.updateProceduralWater(time);
  }

  private updateProceduralWater(time: number) {
    const currentProgress = this.getCurrentProgress(time);
    const currentIntensity = this.getCurrentIntensity(currentProgress);
    const deltaSeconds = this.getWaterDeltaSeconds(time);
    this.currentIntensity = currentIntensity;

    const amplitude = Phaser.Math.Linear(3, 6, currentIntensity);
    this.waterPhase += deltaSeconds * Phaser.Math.Linear(0.45, 0.68, currentIntensity);
    this.tilePhase += deltaSeconds * 0.45;
    this.reflectionPhase += deltaSeconds * Phaser.Math.Linear(1, 1.28, currentIntensity);
    this.ripplePhase += deltaSeconds * Phaser.Math.Linear(0.42, 0.22, currentIntensity);
    this.wakePhase += deltaSeconds * Phaser.Math.Linear(0.18, 0.26, currentIntensity);

    const step = 32;
    const cameraLeft = this.cameras.main.scrollX;

    this.waterTiles.forEach((tile, index) => {
      const tileDrift = Phaser.Math.Linear(0.28, 0.7, currentIntensity);
      tile.y = WATER_TEXTURE_Y + Math.sin(this.tilePhase + index * 0.7) * tileDrift;
      tile.setTint(0xffffff);
      tile.setAlpha(1);
    });

    this.waterBase.clear();
    this.waterBase.fillStyle(0x081820, 1);
    this.waterBase.fillRect(0, WATER_SURFACE_Y, WORLD_WIDTH, HEIGHT - WATER_SURFACE_Y);

    this.waterBack.clear();
    this.waterBack.fillStyle(0x173944, 0.08);
    this.drawWaterFill(this.waterBack, this.waterPhase, amplitude, 1, HEIGHT + 4, step, cameraLeft, currentProgress);

    this.waterBack.fillStyle(0x06141a, 0.1);
    this.waterBack.fillRect(0, WATER_SURFACE_Y + 150, WORLD_WIDTH, HEIGHT - WATER_SURFACE_Y);

    this.waterBack.fillStyle(0x02080d, 0.16);
    this.waterBack.fillRect(0, HEIGHT - 72, WORLD_WIDTH, 72);

    this.waterReflection.clear();
    this.drawDynamicReflections(this.reflectionPhase, currentIntensity);

    this.waterSurface.clear();
    this.waterSurface.lineStyle(2, 0xbad8d9, Phaser.Math.Linear(0.68, 0.9, currentIntensity));
    this.waterSurface.beginPath();
    this.waterSurface.moveTo(0, this.getWaterY(0, this.waterPhase, amplitude, 1, cameraLeft, currentProgress));
    for (let x = 0; x <= WORLD_WIDTH + step; x += step) {
      this.waterSurface.lineTo(x, this.getWaterY(x, this.waterPhase, amplitude, 1, cameraLeft, currentProgress));
    }
    this.waterSurface.strokePath();

    this.waterSurface.lineStyle(1, 0x6b9da4, Phaser.Math.Linear(0.28, 0.45, currentIntensity));
    this.waterSurface.beginPath();
    this.waterSurface.moveTo(0, this.getWaterY(0, this.waterPhase + 0.38, amplitude * 0.64, 1.26, cameraLeft, currentProgress) + 9);
    for (let x = 0; x <= WORLD_WIDTH + step; x += step) {
      this.waterSurface.lineTo(x, this.getWaterY(x, this.waterPhase + 0.38, amplitude * 0.64, 1.26, cameraLeft, currentProgress) + 9);
    }
    this.waterSurface.strokePath();

    this.drawSurfaceGlints(this.ripplePhase, cameraLeft, currentIntensity);
    this.drawCurrentSurge(this.wakePhase, this.waterPhase, cameraLeft, currentProgress, currentIntensity);

    this.waterFront.clear();
    this.waterFront.fillStyle(0x031016, 0.12);
    this.waterFront.fillRect(0, GROUND_Y + 96, WORLD_WIDTH, HEIGHT - GROUND_Y);
    this.drawForegroundRipples(this.ripplePhase, cameraLeft, currentIntensity);
    this.drawCurrentWake(this.wakePhase, cameraLeft, currentProgress, currentIntensity);
    this.drawPlayerLegSplashes(deltaSeconds, currentProgress, cameraLeft, amplitude);
  }

  private drawWaterFill(
    graphics: Phaser.GameObjects.Graphics,
    t: number,
    amplitude: number,
    speed: number,
    bottomY: number,
    step: number,
    cameraLeft: number,
    currentProgress: number,
  ) {
    graphics.beginPath();
    graphics.moveTo(0, this.getWaterY(0, t, amplitude, speed, cameraLeft, currentProgress));
    for (let x = 0; x <= WORLD_WIDTH + step; x += step) {
      graphics.lineTo(x, this.getWaterY(x, t, amplitude, speed, cameraLeft, currentProgress));
    }
    graphics.lineTo(WORLD_WIDTH, bottomY);
    graphics.lineTo(0, bottomY);
    graphics.closePath();
    graphics.fillPath();
  }

  private getWaterDeltaSeconds(time: number) {
    if (this.lastWaterUpdateTime === null) {
      this.lastWaterUpdateTime = time;
      return 0;
    }

    const deltaSeconds = Phaser.Math.Clamp((time - this.lastWaterUpdateTime) / 1000, 0, 0.05);
    this.lastWaterUpdateTime = time;
    return deltaSeconds;
  }

  private drawDynamicReflections(t: number, currentIntensity: number) {
    const lightAlpha = Phaser.Math.Linear(0.14, 0.22, currentIntensity);
    const darkAlpha = Phaser.Math.Linear(0.16, 0.24, currentIntensity);

    for (let tile = 0; tile < WORLD_TILE_COUNT; tile += 1) {
      const baseX = tile * WIDTH;
      this.drawReflectionColumn(baseX + 736, WATER_SURFACE_Y + 18, 42, 150, 0xdcecff, lightAlpha * 0.65, t, tile + 0.6, currentIntensity);
      this.drawReflectionColumn(baseX + 918, WATER_SURFACE_Y + 22, 86, 224, 0xb8ddf0, lightAlpha, t, tile + 1.4, currentIntensity);
      this.drawReflectionColumn(
        baseX + 636,
        WATER_SURFACE_Y + 16,
        12,
        270,
        0xf2444d,
        Phaser.Math.Linear(0.16, 0.26, currentIntensity),
        t,
        tile + 2.1,
        currentIntensity,
      );

      this.drawSpecularStreaks(
        baseX + 735,
        WATER_SURFACE_Y + 170,
        92,
        0xe6f1f4,
        Phaser.Math.Linear(0.11, 0.18, currentIntensity),
        t,
        tile + 3.2,
        currentIntensity,
      );
      this.drawSpecularStreaks(
        baseX + 930,
        WATER_SURFACE_Y + 210,
        112,
        0xcce8f7,
        Phaser.Math.Linear(0.1, 0.16, currentIntensity),
        t,
        tile + 4.1,
        currentIntensity,
      );
      this.drawSpecularStreaks(
        baseX + 918,
        WATER_SURFACE_Y + 288,
        88,
        0xa6d1e4,
        Phaser.Math.Linear(0.08, 0.13, currentIntensity),
        t,
        tile + 4.8,
        currentIntensity,
      );

      for (const x of [170, 264, 300, 400, 610, 760, 1124, 1218]) {
        this.drawReflectionColumn(
          baseX + x,
          WATER_SURFACE_Y + 6,
          x === 610 ? 50 : 24,
          230,
          0x02090e,
          darkAlpha,
          t,
          tile + x * 0.01,
          currentIntensity,
        );
      }
    }
  }

  private drawReflectionColumn(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    alpha: number,
    t: number,
    phase: number,
    currentIntensity: number,
  ) {
    const segmentHeight = Phaser.Math.Linear(2, 3, currentIntensity);
    const gap = Phaser.Math.Linear(13, 10, currentIntensity);
    const driftAmount = Phaser.Math.Linear(4, 11, currentIntensity);

    for (let offsetY = 0; offsetY < height; offsetY += segmentHeight + gap) {
      const progress = offsetY / height;
      const shimmer = 0.72 + Math.sin(t + phase + offsetY * 0.08) * 0.24;
      const segmentWidth = Math.max(5, width * (1 - progress * 0.72) * shimmer);
      const drift = Math.sin(t * 0.8 + phase + offsetY * 0.045) * driftAmount;
      const segmentAlpha = alpha * (1 - progress * 0.78);

      this.drawWavyPatch(
        this.waterReflection,
        x - segmentWidth / 2 + drift,
        y + offsetY,
        segmentWidth,
        segmentHeight,
        color,
        segmentAlpha,
        t,
        phase + offsetY * 0.02,
      );
    }
  }

  private drawSpecularStreaks(
    x: number,
    y: number,
    width: number,
    color: number,
    alpha: number,
    t: number,
    phase: number,
    currentIntensity: number,
  ) {
    for (let i = 0; i < 6; i += 1) {
      const segmentWidth = width * (0.2 + (i % 3) * 0.18);
      const segmentX =
        x - segmentWidth / 2 + Math.sin(t + phase + i) * Phaser.Math.Linear(4, 10, currentIntensity);
      const segmentY = y + i * 13 + Math.cos(t * 0.8 + phase + i) * 2;
      this.drawWavyPatch(this.waterReflection, segmentX, segmentY, segmentWidth, 1.5, color, alpha * (1 - i * 0.11), t, phase + i);
    }
  }

  private drawSurfaceGlints(t: number, cameraLeft: number, currentIntensity: number) {
    this.drawRippleLayers(this.waterSurface, SURFACE_RIPPLE_LAYERS, t, cameraLeft, currentIntensity);
  }

  private drawForegroundRipples(t: number, cameraLeft: number, currentIntensity: number) {
    this.drawRippleLayers(this.waterFront, FOREGROUND_RIPPLE_LAYERS, t, cameraLeft, currentIntensity);
  }

  private drawRippleLayers(
    graphics: Phaser.GameObjects.Graphics,
    layers: RippleLayer[],
    t: number,
    cameraLeft: number,
    currentIntensity: number,
  ) {
    const left = cameraLeft - 140;
    const right = cameraLeft + WIDTH + 140;
    const rippleT = t;

    layers.forEach((layer, layerIndex) => {
      for (let band = 0; band < layer.bands; band += 1) {
        const baseSpacing =
          layer.spacing + Math.sin(layerIndex * 1.7 + band * 0.9) * layer.spacingJitter;
        const spacing = Math.max(58, baseSpacing * Phaser.Math.Linear(1, 1.06, currentIntensity));
        const driftSpeed = layer.driftSpeed;
        const offset = (layerIndex * 113 + band * 67 + rippleT * driftSpeed) % spacing;
        const baseY =
          layer.yStart +
          band * layer.bandGap +
          Math.sin(rippleT * 0.45 + band * 0.8 + layerIndex) * layer.yWave;
        const depth = Phaser.Math.Clamp((baseY - WATER_SURFACE_Y) / (HEIGHT - WATER_SURFACE_Y), 0, 1);

        const firstSlot = Math.floor((left - offset) / spacing) - 2;
        const lastSlot = Math.ceil((right - offset) / spacing) + 2;

        for (let slot = firstSlot; slot <= lastSlot; slot += 1) {
          const seed = layerIndex * 219.7 + band * 61.3 + slot * 37.9;
          if (this.waveNoise(seed + 9.5) < 0.16) continue;

          const x = offset + slot * spacing;
          const segmentX = x + this.signedWaveNoise(seed + 1.1) * spacing * 0.2;
          if (segmentX < left - spacing || segmentX > right + spacing) continue;

          const segmentY = baseY + this.signedWaveNoise(seed + 2.3) * layer.yWave * Phaser.Math.Linear(0.8, 2.4, currentIntensity);
          const lengthScale =
            Phaser.Math.Linear(0.42, 1.65, this.waveNoise(seed + 3.7)) *
            Phaser.Math.Linear(1, 1.35 + depth * 0.45, currentIntensity);
          const width = Math.max(7, (layer.length + this.signedWaveNoise(seed + 4.4) * layer.lengthJitter) * lengthScale);
          const alphaNoise = 0.66 + this.waveNoise(seed + 5.6) * 0.46;
          const alpha = Phaser.Math.Linear(layer.alpha, layer.currentAlpha, currentIntensity) * alphaNoise;
          const lineWidth =
            Math.max(0.35, layer.lineWidth + this.signedWaveNoise(seed + 6.9) * 0.42) *
            Phaser.Math.Linear(0.9, 1.45 + depth * 0.35, currentIntensity);
          const bend =
            layer.bend *
            Phaser.Math.Linear(0.42, 1.85, this.waveNoise(seed + 8.2)) *
            Phaser.Math.Linear(1, 1.38, currentIntensity);
          const shape = this.pickRippleShape(layer.shape, seed);

          graphics.lineStyle(lineWidth, layer.color, alpha);
          this.drawRippleSegment(graphics, segmentX, segmentY, width, bend, shape, rippleT, seed);
        }
      }
    });
  }

  private pickRippleShape(baseShape: RippleShape, seed: number): RippleShape {
    const noise = this.waveNoise(seed + 10.7);
    if (noise < 0.16) return 'short';
    if (noise < 0.38) return 'broken';
    if (noise < 0.68) return baseShape;
    return noise < 0.86 ? 'thread' : 'swell';
  }

  private drawRippleSegment(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    bend: number,
    shape: RippleShape,
    t: number,
    phase: number,
  ) {
    const pointCount = shape === 'short' ? 2 : 3 + Math.floor(this.waveNoise(phase + 11.4) * 4);
    const splitAt = 1 + Math.floor(this.waveNoise(phase + 12.9) * Math.max(1, pointCount - 1));
    const shouldSplit = shape === 'broken' || this.waveNoise(phase + 13.6) < 0.22;
    const skew = this.signedWaveNoise(phase + 14.1) * width * 0.08;
    const tempo = Phaser.Math.Linear(0.12, 0.32, this.waveNoise(phase + 15.2));
    const shapeBend = shape === 'swell' ? bend * 1.35 : shape === 'thread' ? bend * 0.7 : bend;

    graphics.beginPath();
    let drawing = false;

    for (let point = 0; point <= pointCount; point += 1) {
      if (shouldSplit && point === splitAt) {
        drawing = false;
        continue;
      }

      const progress = point / pointCount;
      const taper = Math.sin(progress * Math.PI);
      const pointSeed = phase + point * 17.3;
      const px = x + width * progress + skew * progress + this.signedWaveNoise(pointSeed) * width * 0.035;
      const wave =
        Math.sin(t * tempo + phase + progress * Phaser.Math.Linear(1.6, 4.4, this.waveNoise(pointSeed + 1.9))) *
        shapeBend *
        taper;
      const py = y + wave + this.signedWaveNoise(pointSeed + 2.6) * shapeBend * 0.45;

      if (!drawing) {
        graphics.moveTo(px, py);
        drawing = true;
      } else {
        graphics.lineTo(px, py);
      }
    }

    graphics.strokePath();
  }

  private drawCurrentSurge(
    t: number,
    waterT: number,
    cameraLeft: number,
    progress: number,
    currentIntensity: number,
  ) {
    if (!this.currentActive || currentIntensity <= 0.04) return;

    const frontX = this.getCurrentFrontX(progress);
    const strength = currentIntensity;
    if (strength <= 0.04) return;

    const crestLeft = frontX - 170;
    const crestRight = frontX + 330;

    this.waterSurface.lineStyle(Phaser.Math.Linear(2.5, 6.5, strength), 0xd8f8f2, 0.9 * strength);
    this.waterSurface.beginPath();
    this.waterSurface.moveTo(
      crestLeft,
      this.getWaterY(crestLeft, waterT, 1, 0, cameraLeft, progress) + Math.sin(t * 1.05) * 1.2,
    );

    let crestSlot = 0;
    for (let x = crestLeft + 18; x <= crestRight;) {
      const seed = crestSlot * 13.7;
      this.waterSurface.lineTo(
        x,
        this.getWaterY(x, waterT, 1, 0, cameraLeft, progress) +
        Math.sin(t * 1.45 + x * 0.033) * 2.8 +
        this.signedWaveNoise(seed) * 4.2 * strength,
      );
      x += Phaser.Math.Linear(14, 34, this.waveNoise(seed + 1.4));
      crestSlot += 1;
    }
    this.waterSurface.strokePath();

    this.waterSurface.lineStyle(Phaser.Math.Linear(1.4, 3.2, strength), 0x0b2c34, 0.44 * strength);
    this.waterSurface.beginPath();
    this.waterSurface.moveTo(crestLeft + 40, this.getWaterY(crestLeft + 40, waterT, 1, 0, cameraLeft, progress) + 17);
    let shadowSlot = 0;
    for (let x = crestLeft + 62; x <= crestRight + 70;) {
      const seed = shadowSlot * 17.9 + 4.1;
      this.waterSurface.lineTo(
        x,
        this.getWaterY(x, waterT, 1, 0, cameraLeft, progress) +
        18 +
        Math.sin(t * 1.1 + x * 0.02) * 1.6 +
        this.signedWaveNoise(seed) * 2.8 * strength,
      );
      x += Phaser.Math.Linear(18, 46, this.waveNoise(seed + 3.2));
      shadowSlot += 1;
    }
    this.waterSurface.strokePath();

    for (let i = 0; i < 24; i += 1) {
      const seed = i * 8.7;
      const x = crestLeft + 10 + i * Phaser.Math.Linear(17, 31, this.waveNoise(seed)) + this.signedWaveNoise(seed + 1.3) * 10;
      const y = this.getWaterY(x, waterT, 1, 0, cameraLeft, progress) - 4 + this.signedWaveNoise(seed + 2.4) * 5;
      const width = Phaser.Math.Linear(10, 58, this.waveNoise(seed + 3.6));
      const height = Phaser.Math.Linear(1.2, 4.2, this.waveNoise(seed + 4.8));
      this.drawWavyPatch(this.waterSurface, x, y, width, height, 0xe2fbf5, 0.42 * strength, t * 0.28, seed);
    }
  }

  private drawCurrentWake(t: number, cameraLeft: number, progress: number, currentIntensity: number) {
    if (!this.currentActive || currentIntensity <= 0.04) return;

    const frontX = this.getCurrentFrontX(progress);
    const strength = currentIntensity;
    const alpha = 0.24 * strength;
    const right = cameraLeft + WIDTH + 140;
    const wakeRight = Math.min(right, frontX + Phaser.Math.Linear(420, 900, strength));

    for (let row = 0; row < 7; row += 1) {
      const depth = row / 6;
      const baseY =
        WATER_SURFACE_Y +
        18 +
        Math.pow(depth, 1.18) * (HEIGHT - WATER_SURFACE_Y - 42) +
        this.signedWaveNoise(row + 2.7) * 8;
      const rowAlpha = alpha * Phaser.Math.Linear(0.82, 0.2, depth);
      const start = frontX + 42 + this.signedWaveNoise(row + 4.9) * 90 - depth * 34;
      let x = start;
      let segment = 0;

      while (x < wakeRight) {
        const seed = row * 53.1 + segment * 29.7;
        const localNoise = this.waveNoise(seed);
        const segmentAlpha = rowAlpha * Phaser.Math.Linear(0.22, 0.82, this.waveNoise(seed + 1.2));
        const segmentWidth =
          Phaser.Math.Linear(14, 158, Math.pow(this.waveNoise(seed + 2.5), 1.45)) *
          Phaser.Math.Linear(0.85, 1.35, strength) *
          Phaser.Math.Linear(0.9, 1.25, depth);
        const y =
          baseY +
          this.signedWaveNoise(seed + 3.1) * Phaser.Math.Linear(4, 16, depth) +
          Math.sin(t * Phaser.Math.Linear(0.08, 0.22, localNoise) + seed) * Phaser.Math.Linear(0.8, 3.6, strength);
        const bend = Phaser.Math.Linear(0.45, 5.8, this.waveNoise(seed + 4.4)) * Phaser.Math.Linear(0.65, 1.15, depth);
        const lineWidth =
          Phaser.Math.Linear(0.28, 1.45, this.waveNoise(seed + 5.8)) *
          Phaser.Math.Linear(0.8, 1.3, strength) *
          Phaser.Math.Linear(0.72, 1.05, depth);
        const color = this.waveNoise(seed + 6.6) > 0.68 ? 0xe0f3ef : 0x9cc7c7;

        this.waterFront.lineStyle(lineWidth, color, segmentAlpha);
        this.drawTurbulentRipple(this.waterFront, x, y, segmentWidth, bend, t * 0.24, seed);

        if (this.waveNoise(seed + 7.4) > 0.84) {
          this.waterFront.lineStyle(lineWidth * 0.62, 0xd6f0eb, segmentAlpha * 0.55);
          this.drawTurbulentRipple(
            this.waterFront,
            x + segmentWidth * Phaser.Math.Linear(0.18, 0.62, this.waveNoise(seed + 8.3)),
            y + this.signedWaveNoise(seed + 9.1) * 9,
            segmentWidth * Phaser.Math.Linear(0.18, 0.48, this.waveNoise(seed + 10.4)),
            bend * 0.72,
            t * 0.24,
            seed + 12.5,
          );
        }

        x += Phaser.Math.Linear(105, 280, this.waveNoise(seed + 11.7));
        segment += 1;
      }
    }
  }

  private drawPlayerLegSplashes(
    deltaSeconds: number,
    currentProgress: number,
    cameraLeft: number,
    waterAmplitude: number,
  ) {
    const isWalking = this.lastPlayerAnim === 'player-walk' && this.playerMoveInput !== 0;
    const isDoge = this.lastPlayerAnim === 'player-doge';
    const speedStrength = Phaser.Math.Clamp((this.playerWaterSpeed - 22) / 170, 0, 1);
    // While bracing against a wave (doge) the water churns around the legs even though
    // the player isn't walking — drive those splashes from the wave pressure on them.
    const waveStrength = isDoge ? Phaser.Math.Clamp(this.getWavePressureOnPlayer() * 1.5, 0, 1) : 0;
    const splashStrength = Math.max((isWalking || isDoge) ? speedStrength : 0, waveStrength);
    if (splashStrength <= 0.03) {
      setLoopingSfx(this, 'step_water', false, 0);
      return;
    }

    setLoopingSfx(this, 'step_water', true, 0.11 + splashStrength * 0.11, {
      detune: -24,
    });
    this.legSplashPhase += deltaSeconds * Phaser.Math.Linear(5.6, 8.2, splashStrength);

    const direction = this.playerMoveInput !== 0 ? Math.sign(this.playerMoveInput) : this.facing;
    const wakeDirection = direction > 0 ? -1 : 1;

    LEG_SPLASH_OFFSETS.forEach((offset, legIndex) => {
      const legPhase = this.legSplashPhase + legIndex * Math.PI;
      const footfall = 0.5 + Math.sin(legPhase) * 0.5;
      const contact = 0.48 + footfall * 0.52;
      const legX = this.player.x + offset;
      const surfaceY = this.getWaterY(legX, this.waterPhase, waterAmplitude, 1, cameraLeft, currentProgress);
      const stepIndex = Math.floor(legPhase / Math.PI);
      const seed = legIndex * 101.7 + stepIndex * 23.3;

      this.drawFootContactRipple(legX, surfaceY + 2, splashStrength * contact, seed);
      this.drawFootFoamTrail(legX, surfaceY + 4, wakeDirection, splashStrength * contact, seed + 31.4);

      if (footfall > 0.28) {
        this.drawFootSpray(legX, surfaceY, direction, splashStrength * footfall, seed + 53.8);
      }
    });
  }

  private drawFootContactRipple(x: number, y: number, strength: number, seed: number) {
    const width = Phaser.Math.Linear(24, 56, strength) * Phaser.Math.Linear(0.75, 1.25, this.waveNoise(seed));
    const height = Phaser.Math.Linear(4, 10, strength);
    const alpha = 0.24 + strength * 0.44;

    this.waterFront.lineStyle(1.3 + strength * 1.2, 0xd8f7ef, alpha);
    this.waterFront.beginPath();
    this.waterFront.moveTo(x - width * 0.5, y + this.signedWaveNoise(seed + 1.1) * height);
    this.waterFront.lineTo(x - width * 0.18, y - height * 0.35);
    this.waterFront.moveTo(x - width * 0.04, y + height * 0.22);
    this.waterFront.lineTo(x + width * 0.34, y - height * 0.22);
    this.waterFront.lineTo(x + width * 0.5, y + this.signedWaveNoise(seed + 2.2) * height * 0.45);
    this.waterFront.strokePath();

    this.waterSurface.lineStyle(1.1, 0xffffff, alpha * 0.72);
    this.waterSurface.beginPath();
    this.waterSurface.moveTo(x - width * 0.3, y - 1);
    this.waterSurface.lineTo(x + width * 0.3, y - 1 + this.signedWaveNoise(seed + 3.3) * 1.2);
    this.waterSurface.strokePath();
  }

  private drawFootFoamTrail(x: number, y: number, wakeDirection: number, strength: number, seed: number) {
    const length = Phaser.Math.Linear(24, 70, strength) * Phaser.Math.Linear(0.75, 1.2, this.waveNoise(seed + 1.7));
    const startX = wakeDirection > 0 ? x : x - length;
    const alpha = 0.18 + strength * 0.28;

    this.drawWavyPatch(
      this.waterFront,
      startX,
      y + this.signedWaveNoise(seed + 2.5) * 2,
      length,
      Phaser.Math.Linear(1, 2.6, strength),
      0xdff5ef,
      alpha,
      this.wakePhase,
      seed,
    );
  }

  private drawFootSpray(x: number, y: number, direction: number, strength: number, seed: number) {
    const dropletCount = 4 + Math.floor(strength * 7);

    for (let i = 0; i < dropletCount; i += 1) {
      const dropSeed = seed + i * 9.1;
      const side = this.signedWaveNoise(dropSeed);
      const startX = x + side * Phaser.Math.Linear(4, 20, this.waveNoise(dropSeed + 1.2));
      const startY = y + this.signedWaveNoise(dropSeed + 2.4) * 3;
      const height = Phaser.Math.Linear(7, 26, this.waveNoise(dropSeed + 3.8)) * strength;
      const lean = direction * Phaser.Math.Linear(3, 14, this.waveNoise(dropSeed + 4.6)) * strength;
      const alpha = Phaser.Math.Linear(0.22, 0.68, strength) * Phaser.Math.Linear(0.55, 1, this.waveNoise(dropSeed + 5.1));

      this.waterFront.lineStyle(0.85 + strength * 0.95, 0xe8fff7, alpha);
      this.waterFront.beginPath();
      this.waterFront.moveTo(startX, startY);
      this.waterFront.lineTo(startX - lean + side * 3, startY - height);
      this.waterFront.strokePath();
    }
  }

  private drawTurbulentRipple(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    bend: number,
    t: number,
    seed: number,
  ) {
    const pointCount = 5 + Math.floor(this.waveNoise(seed + 1.5) * 5);
    const gapAt = 1 + Math.floor(this.waveNoise(seed + 2.8) * Math.max(1, pointCount - 1));
    const hasGap = this.waveNoise(seed + 3.3) > 0.48;
    const skew = this.signedWaveNoise(seed + 4.6) * width * 0.06;

    graphics.beginPath();
    let drawing = false;

    for (let point = 0; point <= pointCount; point += 1) {
      if (hasGap && point === gapAt) {
        drawing = false;
        continue;
      }

      const progress = point / pointCount;
      const pointSeed = seed + point * 14.1;
      const px = x + width * progress + skew * progress + this.signedWaveNoise(pointSeed) * width * 0.018;
      const py =
        y +
        Math.sin(t * Phaser.Math.Linear(0.08, 0.24, this.waveNoise(pointSeed + 1.2)) + seed + progress * 4.8) *
        bend *
        0.58 +
        this.signedWaveNoise(pointSeed + 2.5) * bend * 0.22;

      if (!drawing) {
        graphics.moveTo(px, py);
        drawing = true;
      } else {
        graphics.lineTo(px, py);
      }
    }

    graphics.strokePath();
  }

  private getCurrentProgress(time: number) {
    if (!this.currentActive) return 0;
    return Phaser.Math.Clamp((time - this.currentStartedAt) / CURRENT_DURATION, 0, 1);
  }

  private getCurrentIntensity(progress: number) {
    if (!this.currentActive) return 0;

    const rise = this.smoothStep(CURRENT_RISE_START, CURRENT_RISE_END, progress);
    const fall = 1 - this.smoothStep(CURRENT_FALL_START, CURRENT_FALL_END, progress);
    return Phaser.Math.Clamp(rise * fall, 0, 1);
  }

  private smoothStep(edge0: number, edge1: number, value: number) {
    const x = Phaser.Math.Clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  private getCurrentFrontX(progress: number) {
    return this.currentFrontStartX - progress * CURRENT_SURGE_TRAVEL;
  }

  private getWavePressureOnPlayer(playerX = this.playerWorldX) {
    if (!this.currentActive || this.currentIntensity <= 0) return 0;

    const progress = this.getCurrentProgress(this.time.now);
    const frontX = this.getCurrentFrontX(progress);
    const arrival = 1 - this.smoothStep(playerX + 120, playerX + 360, frontX);
    return Phaser.Math.Clamp(arrival * this.currentIntensity, 0, 1);
  }

  private waveNoise(seed: number) {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  }

  private signedWaveNoise(seed: number) {
    return this.waveNoise(seed) * 2 - 1;
  }

  private drawWavyPatch(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    alpha: number,
    t: number,
    phase: number,
  ) {
    const segments = 5;
    graphics.fillStyle(color, alpha);
    graphics.beginPath();
    graphics.moveTo(x, y + Math.sin(t * 0.9 + phase) * 1.2);

    for (let i = 1; i <= segments; i += 1) {
      const px = x + (width * i) / segments;
      graphics.lineTo(px, y + Math.sin(t * 0.9 + phase + i * 0.8) * 1.4);
    }

    for (let i = segments; i >= 0; i -= 1) {
      const px = x + (width * i) / segments;
      graphics.lineTo(px, y + height + Math.sin(t * 1.05 + phase + i * 0.7) * 1.4);
    }

    graphics.closePath();
    graphics.fillPath();
  }

  private getWaterY(
    x: number,
    t: number,
    amplitude: number,
    speed: number,
    _cameraLeft: number,
    currentProgress: number,
  ) {
    let y =
      WATER_SURFACE_Y +
      Math.sin(x * 0.018 + t * speed) * amplitude +
      Math.sin(x * 0.047 - t * speed * 1.7) * amplitude * 0.36;

    if (this.currentActive && this.currentIntensity > 0) {
      const frontX = this.getCurrentFrontX(currentProgress);
      const strength = this.currentIntensity;
      const dx = x - frontX;
      const crest = Math.exp(-(dx * dx) / (2 * 92 * 92));
      const shoulder = Math.exp(-((dx - 145) * (dx - 145)) / (2 * 180 * 180));
      const trailingChop = Math.exp(-((dx - 260) * (dx - 260)) / (2 * 260 * 260));

      y -= 48 * crest * strength;
      y += 20 * shoulder * strength;
      y += Math.sin(dx * 0.11 + t * 1.55) * crest * 6.4 * strength;
      y += Math.sin(dx * 0.043 + t * 1.05) * trailingChop * 3.6 * strength;
    }

    return y;
  }

  private updatePrompt() {
    if (this.isChangingLevel || this.dialogueActive || this.introFadeActive) {
      this.promptText.setVisible(false);
      return;
    }

    let prompt = '';

    if (this.isAtExitDoor()) {
      prompt = 'E  进入下一关';
    } else if (false) {
      prompt = 'E / Space  交给同伴';
    } else if (this.carrier === 'floor' && this.distanceTo(this.anchor.x, this.anchor.y) < 120) {
      prompt = 'E / Space  抱起 SCP Anchor';
    } else if (this.carrier === 'player') {
      prompt = 'E / Space  放下 SCP Anchor';
    }

    this.promptText.setText(prompt);
    this.promptText.setVisible(prompt.length > 0);
  }

  private updateHud(time: number) {
    const carrierLabel = {
      floor: '地面',
      player: '主角携带',
      npc: '同伴携带',
    }[this.carrier];

    this.statusText.setText(`SCP Anchor: ${carrierLabel}`);
    this.objectiveText.setText('在液体中放下 SCP Anchor 可锚定当前位置    实验室出口在最右侧');

    if (!this.currentsUnlocked) {
      this.waterText.setText('CURRENT STANDBY');
      this.waterText.setColor('#6e9aa5');
      return;
    }

    if (this.currentActive) {
      this.waterText.setText('WATER CURRENT');
      this.waterText.setColor(this.isPlayerTethered() ? '#c4f7dd' : '#9be7f4');
    } else {
      const seconds = Math.max(0, Math.ceil((this.nextCurrentAt - time) / 1000));
      this.waterText.setText(`CURRENT IN ${seconds}s`);
      this.waterText.setColor('#6e9aa5');
    }
  }

  private isPlayerTethered() {
    const tether = this.getAnchorTetherState(this.playerWorldX);
    return tether.grounded && tether.distance <= TETHER_LENGTH + 24;
  }

  private distanceTo(x: number, y: number) {
    return Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y);
  }
}

class SecondLevelScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private anchor!: Phaser.GameObjects.Container;
  private anchorRope!: Phaser.GameObjects.Graphics;
  private anchorGlowBack!: Phaser.GameObjects.Ellipse;
  private anchorGlowCore!: Phaser.GameObjects.Ellipse;
  private anchorSilhouette!: Phaser.GameObjects.Sprite;
  private bedImage!: Phaser.GameObjects.Image;
  private bedBurningSprite!: Phaser.GameObjects.Sprite;
  private bedReflection!: Phaser.GameObjects.Image;
  private subjectAsh!: Phaser.GameObjects.Graphics;
  private bloodBase!: Phaser.GameObjects.Graphics;
  private bloodTiles: Phaser.GameObjects.Image[] = [];
  private bloodBack!: Phaser.GameObjects.Graphics;
  private bloodReflection!: Phaser.GameObjects.Graphics;
  private bloodSurface!: Phaser.GameObjects.Graphics;
  private bloodFront!: Phaser.GameObjects.Graphics;
  private horrorOverlay!: Phaser.GameObjects.Rectangle;
  private horrorStatic!: Phaser.GameObjects.Graphics;
  private secondLevelExitDoor!: Phaser.GameObjects.Rectangle;
  private secondLevelExitGlow!: Phaser.GameObjects.Rectangle;
  private promptText!: Phaser.GameObjects.Text;
  private completionText!: Phaser.GameObjects.Text;
  private transitionOverlay!: Phaser.GameObjects.Rectangle;
  private dialoguePanel!: Phaser.GameObjects.Container;
  private dialogueBackground!: Phaser.GameObjects.Rectangle;
  private dialoguePortrait!: Phaser.GameObjects.Image;
  private dialogueSpeakerText!: Phaser.GameObjects.Text;
  private dialogueBodyText!: Phaser.GameObjects.Text;
  private dialogueHintText!: Phaser.GameObjects.Text;
  private incinerationConfirmPanel!: Phaser.GameObjects.Container;
  private incinerationConfirmVisible = false;
  private incinerationSystemArmed = false;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: GameKeyMap;
  private playerWorldX = 150;
  private facing = 1;
  private lastPlayerAnim = '';
  private lastBloodUpdateTime: number | null = null;
  private bloodPhase = 0;
  private bloodTilePhase = 0;
  private bloodReflectionPhase = 0;
  private bloodRipplePhase = 0;
  private bloodSplashPhase = 0;
  private anchorCarried = true;
  private anchorBoundToSubject = false;
  private anchorBindingInProgress = false;
  private anchorDropSplashUntil = 0;
  private incinerationEffectActive = false;
  private incinerationStartedAt = 0;
  private dialogueLines: DialogueLine[] = [];
  private dialogueIndex = 0;
  private dialogueActive = false;
  private dialogueInputConsumed = false;
  private dialogueCompleteHandler: (() => void) | null = null;
  private secondLevelPhase: SecondLevelPhase = 'intro';
  private levelComplete = false;

  constructor() {
    super('SecondLevelScene');
  }

  create(data?: { fromCompletionTransition?: boolean }) {
    this.resetSecondLevelState();
    this.add.rectangle(SECOND_LEVEL_WIDTH / 2, HEIGHT / 2, SECOND_LEVEL_WIDTH, HEIGHT, 0x04070a);

    for (let i = 0; i < SECOND_LEVEL_TILE_COUNT; i += 1) {
      this.add.image(i * WIDTH, 0, 'lab2').setOrigin(0, 0).setDisplaySize(WIDTH, HEIGHT).setAlpha(0.94);
    }

    this.createSecondLevelSeamCovers();
    this.createSecondLevelExitDoor();
    this.createSecondLevelAnimations();
    this.createBedAndPerson();

    this.player = this.physics.add.sprite(this.playerWorldX, GROUND_Y, 'hero-idle', 0);
    this.player.setDepth(30);
    this.player.setCollideWorldBounds(true);
    this.player.body?.setSize(160, 360);
    this.setPlayerAnim('player-idle');

    this.createCarriedAnchor();
    this.createBloodLiquid();
    this.createControls();
    playMusic(this, 'amb_blood_lab', 0.3);

    this.add
      .text(26, 24, 'LEVEL 02', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#d4e4e8',
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.add
      .text(26, 52, '第二关', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#87adb6',
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.promptText = this.add
      .text(WIDTH / 2, HEIGHT - 82, '', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#f4d0d0',
        backgroundColor: 'rgba(16, 3, 5, 0.74)',
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(100);

    this.transitionOverlay = this.add
      .rectangle(0, 0, WIDTH, HEIGHT, 0x000000, 1)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(139)
      .setAlpha(0)
      .setVisible(false);

    this.completionText = this.add
      .text(WIDTH / 2, HEIGHT / 2 - 48, '', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#ffe6e2',
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(140)
      .setVisible(false);

    this.createIncinerationConfirmPanel();
    this.createHorrorEffectLayer();
    this.createDialoguePanel();

    this.cameras.main.setBounds(0, 0, SECOND_LEVEL_WIDTH, HEIGHT);
    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.cameras.main.roundPixels = true;
    this.physics.world.setBounds(0, 0, SECOND_LEVEL_WIDTH, HEIGHT);

    if (data?.fromCompletionTransition) {
      this.playIntroFadeFromBlack(() => this.startSecondLevelIntroDialogue());
    } else {
      this.startSecondLevelIntroDialogue();
    }
  }

  private resetSecondLevelState() {
    this.playerWorldX = 150;
    this.facing = 1;
    this.lastPlayerAnim = '';
    this.lastBloodUpdateTime = null;
    this.bloodPhase = 0;
    this.bloodTilePhase = 0;
    this.bloodReflectionPhase = 0;
    this.bloodRipplePhase = 0;
    this.bloodSplashPhase = 0;
    this.anchorCarried = true;
    this.anchorBoundToSubject = false;
    this.anchorBindingInProgress = false;
    this.anchorDropSplashUntil = 0;
    this.incinerationEffectActive = false;
    this.incinerationStartedAt = 0;
    this.dialogueLines = [];
    this.dialogueIndex = 0;
    this.dialogueActive = false;
    this.dialogueInputConsumed = false;
    this.dialogueCompleteHandler = null;
    this.secondLevelPhase = 'intro';
    this.levelComplete = false;
    this.incinerationConfirmVisible = false;
    this.incinerationSystemArmed = false;
  }

  update(time: number, delta: number) {
    this.dialogueInputConsumed = false;
    this.updateDialogueInput();
    this.handleLevelHotkeys();

    let move = 0;
    if (this.cursors.left?.isDown || this.keys.a.isDown) move -= 1;
    if (this.cursors.right?.isDown || this.keys.d.isDown) move += 1;
    if (
      this.secondLevelPhase === 'intro' ||
      this.secondLevelPhase === 'incinerating' ||
      this.dialogueActive ||
      this.anchorBindingInProgress ||
      this.incinerationConfirmVisible ||
      this.incinerationEffectActive
    ) {
      move = 0;
    }

    const deltaSeconds = Math.min(delta, 50) / 1000;
    this.playerWorldX = Phaser.Math.Clamp(
      this.playerWorldX + move * SECOND_LEVEL_PLAYER_SPEED * deltaSeconds,
      58,
      SECOND_LEVEL_WIDTH - 58,
    );
    if (!this.anchorCarried && !this.anchorBoundToSubject) {
      this.constrainPlayerByDroppedAnchor();
    }
    this.player.x = Math.round(this.playerWorldX);
    this.player.y = GROUND_Y;
    this.player.setVelocity(0, 0);

    if (move !== 0) {
      this.facing = move > 0 ? 1 : -1;
      this.player.setFlipX(this.facing < 0);
      this.setPlayerAnim('player-walk');
    } else {
      this.setPlayerAnim('player-idle');
    }
    setLoopingSfx(this, 'step_blood', move !== 0, 0.18, {
      detune: -42,
    });

    this.handleAnchorInteractionInput();
    if (this.anchorBindingInProgress) {
      this.updateAnchorGlow();
    } else if (this.anchorCarried) {
      this.updateCarriedAnchor(move !== 0);
    } else if (this.anchorBoundToSubject) {
      this.updateSubjectBoundAnchor();
    } else {
      this.updateDroppedAnchor();
    }
    this.updatePrompt();
    this.updateBloodLiquid(time, deltaSeconds, move);
    this.updateHorrorEffect(time);
  }

  private handleAnchorInteractionInput() {
    if (this.levelComplete) return;

    if (this.incinerationConfirmVisible) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.e)) {
        playSfx(this, 'ui_confirm', 0.36);
        this.startIncinerationSequence();
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        playSfx(this, 'ui_cancel', 0.28);
        this.hideIncinerationConfirm();
      }
      return;
    }

    if (
      this.secondLevelPhase === 'intro' ||
      this.dialogueActive ||
      this.dialogueInputConsumed ||
      this.anchorBindingInProgress ||
      this.incinerationEffectActive
    ) {
      return;
    }

    const pressedExit = Phaser.Input.Keyboard.JustDown(this.keys.e);
    const pressedInteract = pressedExit || Phaser.Input.Keyboard.JustDown(this.keys.space);
    if (!pressedInteract) return;

    if (pressedExit && this.isAtSecondLevelExit()) {
      if (this.secondLevelPhase === 'exitOpen') {
        this.completeSecondLevel();
      }
      return;
    }

    if (pressedExit && this.isNearBedSubject() && this.secondLevelPhase === 'approachSubject') {
      this.startSubjectCheckDialogue();
      return;
    }

    if (
      pressedExit &&
      this.anchorCarried &&
      this.isNearBedSubject() &&
      this.secondLevelPhase === 'readyToBind'
    ) {
      this.bindAnchorToSubject();
      return;
    }

    if (
      pressedExit &&
      this.anchorBoundToSubject &&
      this.isNearBedSubject() &&
      this.secondLevelPhase === 'readyToIncinerate' &&
      !this.incinerationSystemArmed
    ) {
      this.showIncinerationConfirm();
      return;
    }

    if (pressedExit && this.isNearBedSubject() && this.secondLevelPhase === 'askSubject') {
      this.startSubjectStatusDialogue();
      return;
    }

    if (
      pressedExit &&
      this.anchorBoundToSubject &&
      this.isNearBedSubject() &&
      this.secondLevelPhase === 'recoverAnchor'
    ) {
      this.recoverAnchorFromSubject();
      return;
    }

    if (pressedExit && this.isNearBedSubject() && this.secondLevelPhase === 'reportResult') {
      this.startResultConfirmationDialogue();
      return;
    }

    if (this.anchorBoundToSubject) return;

    const canUseAnchorFreely =
      this.secondLevelPhase === 'approachSubject' || this.secondLevelPhase === 'readyToBind';
    if (!canUseAnchorFreely) return;

    if (this.anchorCarried) {
      this.anchorCarried = false;
      const dropDirection = this.facing;
      this.anchor.x = Phaser.Math.Clamp(this.player.x + dropDirection * 76, 40, SECOND_LEVEL_WIDTH - 40);
      this.anchor.y = GROUND_Y - 36;
      playSfx(this, 'anchor_drop_blood', 0.5);
      return;
    }

    if (this.distanceTo(this.anchor.x, this.anchor.y) < 120) {
      this.anchorCarried = true;
      playSfx(this, 'anchor_retrieve', 0.42);
    }
  }

  private playIntroFadeFromBlack(onComplete?: () => void) {
    this.transitionOverlay.setAlpha(1).setVisible(true);
    this.promptText.setVisible(false);
    this.time.delayedCall(140, () => {
      this.tweens.add({
        targets: this.transitionOverlay,
        alpha: 0,
        duration: 720,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this.transitionOverlay.setVisible(false);
          onComplete?.();
        },
      });
    });
  }

  private createDialoguePanel() {
    const panel = this.add.container(WIDTH / 2, HEIGHT - 96).setScrollFactor(0).setDepth(130).setVisible(false);
    this.dialogueBackground = this.add.rectangle(0, 0, 980, 166, 0x0c0808, 0.9);
    this.dialogueBackground.setStrokeStyle(1, 0xb79b8f, 0.3);

    this.dialoguePortrait = this.add
      .image(-438, 120, 'main-character-portrait')
      .setDisplaySize(MAIN_CHARACTER_PORTRAIT_WIDTH, MAIN_CHARACTER_PORTRAIT_HEIGHT)
      .setOrigin(0.5, 1)
      .setVisible(false);

    this.dialogueSpeakerText = this.add
      .text(-436, -62, '', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffe6e2',
      })
      .setOrigin(0, 0);

    this.dialogueBodyText = this.add
      .text(-436, -28, '', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ddbabc',
        wordWrap: { width: 872 },
        lineSpacing: 7,
      })
      .setOrigin(0, 0);

    this.dialogueHintText = this.add
      .text(436, 56, 'E / Space 继续', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#b8837c',
      })
      .setOrigin(1, 0);

    panel.add([
      this.dialogueBackground,
      this.dialoguePortrait,
      this.dialogueSpeakerText,
      this.dialogueBodyText,
      this.dialogueHintText,
    ]);
    this.dialoguePanel = panel;
  }

  private startDialogue(lines: DialogueLine[], onComplete?: () => void) {
    this.dialogueLines = lines;
    this.dialogueIndex = 0;
    this.dialogueCompleteHandler = onComplete ?? null;
    this.dialogueActive = this.dialogueLines.length > 0;
    this.dialoguePanel.setVisible(this.dialogueActive);

    if (!this.dialogueActive) {
      this.finishDialogue();
      return;
    }

    this.renderDialogueLine();
  }

  private updateDialogueInput() {
    if (!this.dialogueActive) return;

    const advancePressed =
      Phaser.Input.Keyboard.JustDown(this.keys.e) || Phaser.Input.Keyboard.JustDown(this.keys.space);
    if (!advancePressed) return;

    this.dialogueInputConsumed = true;
    playSfx(this, 'ui_next', 0.18);
    this.dialogueIndex += 1;

    if (this.dialogueIndex >= this.dialogueLines.length) {
      this.finishDialogue();
      return;
    }

    this.renderDialogueLine();
  }

  private finishDialogue() {
    this.dialogueActive = false;
    this.dialoguePanel.setVisible(false);

    const completeHandler = this.dialogueCompleteHandler;
    this.dialogueCompleteHandler = null;
    completeHandler?.();
  }

  private renderDialogueLine() {
    const line = this.dialogueLines[this.dialogueIndex];
    if (!line) return;

    const showPortrait = line.portrait === 'player' || line.speaker === '操作员';
    const isInnerThought = line.speaker.includes('内心');
    this.dialoguePortrait.setVisible(showPortrait);
    this.dialogueBackground
      .setPosition(showPortrait ? 112 : 0, showPortrait ? 14 : 0)
      .setSize(showPortrait ? 900 : 980, showPortrait ? 154 : 166)
      .setFillStyle(showPortrait ? 0x0b0808 : 0x120305, showPortrait ? 0.86 : 0.94);
    this.dialogueBackground.setStrokeStyle(1, showPortrait ? 0xb79b8f : 0xff8a7c, showPortrait ? 0.28 : 0.34);
    this.dialogueSpeakerText.setX(showPortrait ? -282 : -436);
    this.dialogueSpeakerText.setY(showPortrait ? -42 : -62);
    this.dialogueBodyText.setX(showPortrait ? -282 : -436);
    this.dialogueBodyText.setY(showPortrait ? -4 : -28);
    this.dialogueBodyText.setWordWrapWidth(showPortrait ? 790 : 872);
    this.dialogueHintText.setX(showPortrait ? 520 : 436);
    this.dialogueHintText.setY(showPortrait ? 58 : 56);
    this.dialogueSpeakerText.setColor(isInnerThought ? '#ffd9bc' : '#ffe6e2');
    this.dialogueBodyText.setColor(isInnerThought ? '#f1d7c8' : '#ddbabc');
    this.dialogueSpeakerText.setText(line.speaker);
    this.dialogueBodyText.setText(line.text);
    playDialogueVoice(this, line);
    this.dialogueHintText.setText(
      this.dialogueIndex === this.dialogueLines.length - 1 ? 'E / Space 结束' : 'E / Space 继续',
    );
  }

  private startSecondLevelIntroDialogue() {
    this.secondLevelPhase = 'intro';
    this.startDialogue(
      [
        {
          speaker: '研究员 / 血液介质测试室',
          text: '第二阶段开始。媒介由水替换为血液，目标是观察 SCP-Anchor 在生命介质中的锚定结果。',
        },
        {
          speaker: '操作员 / 内心',
          text: '把血液也叫“介质”……他们说得越平静，事情就越不对劲。',
          portrait: 'player',
        },
        {
          speaker: '研究员 / 血液介质测试室',
          text: '床上人员为 D-2047，已固定并保持基础意识反应。靠近实验体，先检查状态，不要擅自解除拘束。',
        },
        {
          speaker: '操作员',
          text: '好的...',
          portrait: 'player',
        },
        {
          speaker: '研究员 / 血液介质测试室',
          text: '携带 SCP-Anchor 接近目标。确认实验体仍有反应后，按指令将锚绑定到他身上，让锚落入血液。',
        },
      ],
      () => {
        this.secondLevelPhase = 'approachSubject';
      },
    );
  }

  private startSubjectCheckDialogue() {
    this.startDialogue(
      [
        {
          speaker: 'D-2047',
          text: '你是来放我出去的吗？这里的血一直在动，我听见它下面有东西。',
        },
        {
          speaker: '操作员',
          text: '放心，你会没事的。',
          portrait: 'player',
        },
        {
          speaker: '研究员 / 通讯',
          text: '确认语言反应。下一步，将 SCP-Anchor 绑定到实验体胸腔固定点。绑定完成后立刻后退半步。',
        },
      ],
      () => {
        this.secondLevelPhase = 'readyToBind';
      },
    );
  }

  private startPostBindingDialogue() {
    this.startDialogue(
      [
        {
          speaker: '研究员 / 通讯',
          text: '绑定完成。锚已进入血液媒介，反馈稳定。现在在床边启动实验流程。',
        },
        {
          speaker: '研究员 / 通讯',
          text: '系统会要求二次确认。确认后执行焚烧，不要中断画面记录。',
        },
      ],
      () => {
        this.secondLevelPhase = 'readyToIncinerate';
      },
    );
  }

  private startPostIncinerationDialogue() {
    this.startDialogue(
      [
        {
          speaker: '研究员 / 通讯',
          text: '焚烧结束。肉体完整性读数为零，但锚点反馈仍存在清晰意识信号。',
        },
        {
          speaker: '操作员 / 内心',
          text: '肉体完整性为零，却还在“清晰”。这报告写出来也没人会睡得着。',
          portrait: 'player',
        },
        {
          speaker: '研究员 / 通讯',
          text: '靠近实验体残留位置，询问 D-2047 当前状态。记录主观痛感和异常听觉。',
        },
      ],
      () => {
        this.secondLevelPhase = 'askSubject';
      },
    );
  }

  private startSubjectStatusDialogue() {
    this.startDialogue(
      [
        {
          speaker: '操作员',
          text: 'D-2047，听得见吗？描述你现在的状态。',
          portrait: 'player',
        },
        {
          speaker: 'D-2047',
          text: '我还在。每一秒都很清楚。十分痛苦，还有来自地狱的呼喊。',
        },
        {
          speaker: 'D-2047',
          text: '有什么东西抓住了我，让我无法脱离痛苦。我没有身体了，可我还在这里。',
        },
        {
          speaker: '操作员',
          text: '你会没事的。我们会帮你解除痛苦。',
          portrait: 'player',
        },
      ],
      () => {
        this.startRecoverAnchorInstructionDialogue();
      },
    );
  }

  private startRecoverAnchorInstructionDialogue() {
    this.startDialogue(
      [
        {
          speaker: '研究员 / 通讯',
          text: '记录完毕。现在回收 SCP-Anchor，将它重新绑定到你身上。',
        },
        {
          speaker: '研究员 / 通讯',
          text: '不要继续让锚固定 D-2047。解绑动作完成后，继续观察残留反应。',
        },
      ],
      () => {
        this.secondLevelPhase = 'recoverAnchor';
      },
    );
  }

  private startPostAnchorRecoveryDialogue() {
    this.startDialogue(
      [
        {
          speaker: '系统记录',
          text: 'SCP-Anchor 断开后，床上的残余物无声塌落成灰。D-2047 的意识反馈消失，没有再发出任何声音。',
        },
        {
          speaker: '操作员 / 内心',
          text: '房间终于安静了。',
          portrait: 'player',
        },
        {
          speaker: '研究员 / 通讯',
          text: '锚已回收。向我报告最终结果。',
        },
      ],
      () => {
        this.secondLevelPhase = 'reportResult';
      },
    );
  }

  private startResultConfirmationDialogue() {
    this.startDialogue(
      [
        {
          speaker: '操作员',
          text: 'SCP-Anchor 已回收并重新绑定在我身上。D-2047 解绑后失去所有反应，残余物静默塌散成灰。',
          portrait: 'player',
        },
        {
          speaker: '研究员 / 通讯',
          text: '结论记录：SCP-Anchor 在介质为血液时，可以最大程度保留生命。锚定期间，即便烧成灰，人的意识依旧清晰。',
        },
        {
          speaker: '研究员 / 通讯',
          text: '血液介质锚定测试完成。最右侧大门已解除锁定，离开测试室。',
        },
        {
          speaker: '操作员 / 内心',
          text: '这倒影的状况要不要报告一下。。。',
          portrait: 'player',
        },
      ],
      () => {
        this.openSecondLevelExit();
      },
    );
  }

  private createIncinerationConfirmPanel() {
    const panel = this.add.container(WIDTH / 2, HEIGHT / 2).setScrollFactor(0).setDepth(138).setVisible(false);
    const shade = this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x050001, 0.42);
    const background = this.add.rectangle(0, 0, 620, 178, 0x130305, 0.96);
    background.setStrokeStyle(1, 0xff7b68, 0.52);

    const title = this.add
      .text(-270, -58, '焚烧系统确认', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffe6e2',
      })
      .setOrigin(0, 0);

    const body = this.add
      .text(-270, -16, '是否确认开启焚烧系统', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#ffd0c8',
      })
      .setOrigin(0, 0);

    const hint = this.add
      .text(270, 52, 'E 确认    Space 取消', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#b8837c',
      })
      .setOrigin(1, 0);

    panel.add([shade, background, title, body, hint]);
    this.incinerationConfirmPanel = panel;
  }

  private showIncinerationConfirm() {
    this.incinerationConfirmVisible = true;
    this.promptText.setVisible(false);
    this.incinerationConfirmPanel.setVisible(true);
    playSfx(this, 'ui_popup', 0.34);
  }

  private hideIncinerationConfirm() {
    this.incinerationConfirmVisible = false;
    this.incinerationConfirmPanel.setVisible(false);
  }

  private createHorrorEffectLayer() {
    this.horrorOverlay = this.add
      .rectangle(0, 0, WIDTH, HEIGHT, 0x2a0003, 1)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(136)
      .setAlpha(0)
      .setVisible(false);

    this.horrorStatic = this.add.graphics().setScrollFactor(0).setDepth(137).setVisible(false);
  }

  private startIncinerationSequence() {
    if (this.incinerationSystemArmed) return;

    this.secondLevelPhase = 'incinerating';
    this.incinerationSystemArmed = true;
    this.incinerationEffectActive = false;
    this.hideIncinerationConfirm();
    this.promptText.setVisible(false);
    playSfx(this, 'fire_loop', 0.34, { delay: 1.12 });

    this.time.delayedCall(1180, () => {
      this.bedImage.setVisible(false);
      this.bedBurningSprite
        .setTexture('lab2-bed-start-burn', 0)
        .setScale(SECOND_LEVEL_BED_BURNING_SCALE)
        .setAngle(0)
        .setAlpha(0)
        .setVisible(true);
      this.bedReflection.setTint(0x5f0908).setAlpha(0.32);
      this.tweens.add({
        targets: this.bedBurningSprite,
        alpha: 1,
        duration: 220,
        ease: 'Quad.easeOut',
      });
      this.bedBurningSprite.once('animationcomplete', () => {
        this.bedBurningSprite.play('bed-burning-loop');
      });
      this.bedBurningSprite.play('bed-start-burn');
    });

    this.time.delayedCall(SECOND_LEVEL_BURN_DURATION_MS, () => this.startPostBurnHorrorEffect());
  }

  private startPostBurnHorrorEffect() {
    this.incinerationEffectActive = true;
    this.incinerationStartedAt = this.time.now;
    this.horrorOverlay.setAlpha(0.16).setVisible(true);
    this.horrorStatic.clear().setVisible(true);
    playSfx(this, 'incinerator_start', 0.52);
    playSfx(this, 'horror_hit', 0.5, { delay: 0.08 });
    this.cameras.main.shake(1000, 0.006);
    this.cameras.main.flash(90, 110, 0, 8);

    this.time.delayedCall(SECOND_LEVEL_POST_BURN_HORROR_DURATION_MS, () => {
      this.incinerationEffectActive = false;
      this.horrorStatic.clear().setVisible(false);
      this.tweens.add({
        targets: this.horrorOverlay,
        alpha: 0,
        duration: 360,
        ease: 'Sine.easeOut',
        onComplete: () => {
          this.horrorOverlay.setVisible(false);
          this.startPostIncinerationDialogue();
        },
      });
    });
  }

  private updateHorrorEffect(time: number) {
    if (!this.incinerationEffectActive) return;

    const elapsed = time - this.incinerationStartedAt;
    const progress = Phaser.Math.Clamp(elapsed / SECOND_LEVEL_POST_BURN_HORROR_DURATION_MS, 0, 1);
    const jitterFrame = Math.floor(time / 34);
    const pulse = 0.5 + Math.sin(time * 0.046) * 0.5;
    this.horrorOverlay.setAlpha(Phaser.Math.Linear(0.18, 0.42, pulse) * (1 - progress * 0.34));

    this.horrorStatic.clear();
    this.horrorStatic.fillStyle(0x000000, 0.2 + pulse * 0.12);
    this.horrorStatic.fillRect(0, 0, WIDTH, 46);
    this.horrorStatic.fillRect(0, HEIGHT - 58, WIDTH, 58);

    for (let i = 0; i < 28; i += 1) {
      const noise = this.bloodNoise(i * 19.7 + jitterFrame * 3.1);
      const signed = noise * 2 - 1;
      const y = (i * 27 + jitterFrame * (4 + (i % 5)) + signed * 18) % HEIGHT;
      const x = this.bloodNoise(i * 31.3 + jitterFrame) * WIDTH - 90;
      const length = Phaser.Math.Linear(WIDTH * 0.18, WIDTH * 0.92, noise);
      const color = i % 6 === 0 ? 0xffc0aa : i % 2 === 0 ? 0x8d1014 : 0x120002;
      const alpha = Phaser.Math.Linear(0.14, 0.44, noise) * (1 - progress * 0.25);
      const width = i % 6 === 0 ? 1.1 : 2.3;

      this.horrorStatic.lineStyle(width, color, alpha);
      this.horrorStatic.lineBetween(x, y, x + length, y + signed * 5);
    }

    const scanY = (jitterFrame * 23) % HEIGHT;
    this.horrorStatic.lineStyle(5, 0xff2b22, 0.14 + pulse * 0.18);
    this.horrorStatic.lineBetween(0, scanY, WIDTH, scanY + 8);
  }

  private bindAnchorToSubject() {
    this.secondLevelPhase = 'bindingAnchor';
    this.anchorCarried = false;
    this.anchorBoundToSubject = true;
    this.anchorBindingInProgress = true;
    this.anchorRope.clear();
    this.promptText.setVisible(false);
    playSfx(this, 'anchor_bind', 0.48);

    this.anchor.setDepth(ANCHOR_CARRY_DEPTH);
    this.anchor.setScale(ANCHOR_CARRY_SCALE);
    this.anchor.setRotation(-0.08);
    this.anchor.x = SECOND_LEVEL_SUBJECT_BIND_X;
    this.anchor.y = SECOND_LEVEL_SUBJECT_BIND_Y + 22;

    this.tweens.add({
      targets: this.anchor,
      x: SECOND_LEVEL_SUBJECT_ANCHOR_DROP_X,
      y: SECOND_LEVEL_SUBJECT_ANCHOR_DROP_Y,
      scaleX: 0.68,
      scaleY: 0.68,
      rotation: 0,
      duration: 720,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.anchorBindingInProgress = false;
        this.anchorDropSplashUntil = this.time.now + 900;
        this.anchor.setDepth(ANCHOR_SUBMERGED_DEPTH);
        playSfx(this, 'anchor_drop_blood', 0.52);
        this.startPostBindingDialogue();
      },
    });
  }

  private recoverAnchorFromSubject() {
    this.secondLevelPhase = 'reclaimingAnchor';
    this.anchorBindingInProgress = true;
    this.anchorBoundToSubject = false;
    this.anchorCarried = false;
    this.anchorRope.clear();
    this.promptText.setVisible(false);
    playSfx(this, 'anchor_retrieve', 0.48);

    const hand = this.getCarrierHandPoint(this.player, this.lastPlayerAnim || 'player-idle');
    this.anchor.setDepth(ANCHOR_CARRY_DEPTH);

    this.tweens.add({
      targets: this.anchor,
      x: hand.x,
      y: hand.y + 54 * ANCHOR_CARRY_SCALE,
      scaleX: ANCHOR_CARRY_SCALE,
      scaleY: ANCHOR_CARRY_SCALE,
      rotation: -0.06,
      duration: 760,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.anchorCarried = true;
        this.playEndBurnSequence();
      },
    });
  }

  private playEndBurnSequence() {
    playSfx(this, 'ash_fall', 0.34);
    this.bedBurningSprite
      .stop()
      .clearTint()
      .setTexture('lab2-bed-end-burn', 0)
      .setScale(SECOND_LEVEL_BED_BURNING_SCALE)
      .setAlpha(1)
      .setVisible(true);
    this.bedReflection.setTint(0x6a1714).setAlpha(0.28);
    this.cameras.main.shake(420, 0.0025);

    this.bedBurningSprite.once('animationcomplete', () => {
      this.anchorBindingInProgress = false;
      this.turnSubjectToAsh();
      this.startPostAnchorRecoveryDialogue();
    });
    this.bedBurningSprite.play('bed-end-burn');
  }

  private turnSubjectToAsh() {
    this.bedBurningSprite.stop();
    this.bedBurningSprite.setTint(0x4a3e3c);
    this.bedReflection.setTint(0x312628).setAlpha(0.18);
    playSfx(this, 'ash_fall', 0.42);

    this.drawSubjectAsh();
    this.subjectAsh.setAlpha(0).setVisible(true);

    this.tweens.add({
      targets: this.bedBurningSprite,
      alpha: 0.22,
      duration: 520,
      ease: 'Sine.easeOut',
    });

    this.tweens.add({
      targets: this.subjectAsh,
      alpha: 1,
      duration: 620,
      ease: 'Sine.easeOut',
    });
  }

  private drawSubjectAsh() {
    this.subjectAsh.clear();
    this.subjectAsh.fillStyle(0x161313, 0.58);
    this.subjectAsh.fillEllipse(SECOND_LEVEL_BED_X + 8, SECOND_LEVEL_BED_Y + 72, 210, 42);
    this.subjectAsh.fillStyle(0x5d5654, 0.82);
    this.subjectAsh.fillEllipse(SECOND_LEVEL_BED_X + 4, SECOND_LEVEL_BED_Y + 62, 168, 28);
    this.subjectAsh.fillStyle(0x8b8580, 0.5);
    this.subjectAsh.fillEllipse(SECOND_LEVEL_BED_X - 42, SECOND_LEVEL_BED_Y + 54, 48, 12);
    this.subjectAsh.fillEllipse(SECOND_LEVEL_BED_X + 38, SECOND_LEVEL_BED_Y + 58, 58, 14);

    for (let i = 0; i < 28; i += 1) {
      const seed = i * 12.73;
      const x = SECOND_LEVEL_BED_X - 92 + this.bloodNoise(seed) * 184;
      const y = SECOND_LEVEL_BED_Y + 42 + this.bloodNoise(seed + 3.1) * 48;
      const radius = 1.4 + this.bloodNoise(seed + 7.7) * 3.6;
      this.subjectAsh.fillStyle(i % 3 === 0 ? 0xa59d96 : 0x6c6561, 0.44 + this.bloodNoise(seed + 2.2) * 0.34);
      this.subjectAsh.fillCircle(x, y, radius);
    }
  }

  private isAtSecondLevelExit() {
    return Math.abs(this.playerWorldX - SECOND_LEVEL_EXIT_X) <= EXIT_INTERACT_RANGE;
  }

  private isNearBedSubject() {
    return Math.abs(this.playerWorldX - SECOND_LEVEL_BED_X) <= SECOND_LEVEL_SUBJECT_INTERACT_RANGE;
  }

  private completeSecondLevel() {
    this.levelComplete = true;
    this.promptText.setVisible(false);
    this.completionText.setVisible(false);
    this.transitionOverlay.setAlpha(0).setVisible(true);
    playSfx(this, 'test_complete', 0.42);
    playSfx(this, 'door', 0.42, { delay: 0.24 });
    this.tweens.add({
      targets: this.transitionOverlay,
      alpha: 1,
      duration: 420,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.completionText.setText('血液介质锚定测试完成').setVisible(true);
        this.time.delayedCall(1350, () => {
          startGameScene(this, 'ThirdLevelScene', { fromCompletionTransition: true });
        });
      },
    });
  }

  private updatePrompt() {
    if (
      this.levelComplete ||
      this.secondLevelPhase === 'intro' ||
      this.secondLevelPhase === 'incinerating' ||
      this.dialogueActive ||
      this.anchorBindingInProgress ||
      this.incinerationConfirmVisible ||
      this.incinerationEffectActive
    ) {
      this.promptText.setVisible(false);
      return;
    }

    let prompt = '';
    if (this.isAtSecondLevelExit()) {
      prompt = this.secondLevelPhase === 'exitOpen' ? 'E  进入开启的大门' : '大门锁定：完成血液介质测试后开启';
    } else if (this.isNearBedSubject() && this.secondLevelPhase === 'approachSubject') {
      prompt = 'E  检查床上的 D 级人员';
    } else if (this.isNearBedSubject() && this.secondLevelPhase === 'readyToBind') {
      prompt = this.anchorCarried ? 'E  将 SCP-Anchor 绑定到 D 级人员' : '先取回 SCP-Anchor，再进行绑定';
    } else if (this.isNearBedSubject() && this.secondLevelPhase === 'readyToIncinerate') {
      prompt = 'E  开始实验';
    } else if (this.isNearBedSubject() && this.secondLevelPhase === 'askSubject') {
      prompt = 'E  询问 D 级人员状态';
    } else if (this.isNearBedSubject() && this.secondLevelPhase === 'recoverAnchor') {
      prompt = 'E  回收 SCP-Anchor，并绑定回自己身上';
    } else if (this.isNearBedSubject() && this.secondLevelPhase === 'reportResult') {
      prompt = 'E  向研究员确认结果';
    } else if (this.secondLevelPhase === 'exitOpen') {
      prompt = '最右侧大门已开启';
    } else if (
      this.anchorCarried &&
      (this.secondLevelPhase === 'approachSubject' || this.secondLevelPhase === 'readyToBind')
    ) {
      prompt = 'E / Space  放下 SCP-Anchor';
    } else if (
      (this.secondLevelPhase === 'approachSubject' || this.secondLevelPhase === 'readyToBind') &&
      this.distanceTo(this.anchor.x, this.anchor.y) < 120
    ) {
      prompt = 'E / Space  取回 SCP-Anchor';
    }

    this.promptText.setText(prompt);
    this.promptText.setVisible(prompt.length > 0);
  }

  private createSecondLevelSeamCovers() {
    [WIDTH, WIDTH * 2].forEach((x) => {
      this.add.rectangle(x - 56, HEIGHT / 2, 42, HEIGHT, 0x020506, 0.24).setDepth(2.8);
      this.add.rectangle(x + 56, HEIGHT / 2, 42, HEIGHT, 0x020506, 0.24).setDepth(2.8);
      this.add.rectangle(x, HEIGHT / 2, 76, HEIGHT, 0x020506, 0.7).setDepth(3);
      this.add.rectangle(x, WATER_SURFACE_Y + (HEIGHT - WATER_SURFACE_Y) / 2, 154, HEIGHT - WATER_SURFACE_Y, 0x2a0408, 0.2).setDepth(3.1);

      const frame = this.add.graphics().setDepth(3.2);
      frame.lineStyle(1, 0x496066, 0.2);
      frame.lineBetween(x - 38, 0, x - 38, HEIGHT);
      frame.lineBetween(x + 38, 0, x + 38, HEIGHT);
      frame.lineStyle(2, 0x02090c, 0.58);
      frame.lineBetween(x - 22, 0, x - 22, HEIGHT);
      frame.lineBetween(x + 22, 0, x + 22, HEIGHT);

      frame.fillStyle(0x0b1417, 0.64);
      for (let y = 78; y < HEIGHT; y += 138) {
        frame.fillRect(x - 42, y, 84, 12);
      }
    });
  }

  private createSecondLevelExitDoor() {
    this.secondLevelExitGlow = this.add
      .rectangle(SECOND_LEVEL_EXIT_X, EXIT_DOOR_Y, EXIT_DOOR_WIDTH + 56, EXIT_DOOR_HEIGHT + 54, 0x3a080a, 0.28)
      .setDepth(3.4)
      .setVisible(false);

    this.secondLevelExitDoor = this.add
      .rectangle(SECOND_LEVEL_EXIT_X, EXIT_DOOR_Y, EXIT_DOOR_WIDTH, EXIT_DOOR_HEIGHT, 0x080203, 0.84)
      .setDepth(4.2);
    this.secondLevelExitDoor.setStrokeStyle(3, 0x7c171a, 0.62);

    const slit = this.add.rectangle(SECOND_LEVEL_EXIT_X, EXIT_DOOR_Y, 12, EXIT_DOOR_HEIGHT - 36, 0x1a0506, 0.86);
    slit.setDepth(4.3);
  }

  private openSecondLevelExit() {
    if (this.secondLevelPhase === 'exitOpen') return;

    this.secondLevelPhase = 'exitOpen';
    this.secondLevelExitDoor.setFillStyle(0x07100f, 0.58);
    this.secondLevelExitDoor.setStrokeStyle(3, 0xffb1a6, 0.82);
    this.secondLevelExitGlow.setAlpha(0).setVisible(true);
    playSfx(this, 'door_open', 0.34);

    this.tweens.add({
      targets: this.secondLevelExitGlow,
      alpha: 0.42,
      duration: 520,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createSecondLevelAnimations() {
    ensureCoreAnimations(this);

    if (!this.anims.exists('bed-start-burn')) {
      this.anims.create({
        key: 'bed-start-burn',
        frames: this.anims.generateFrameNumbers('lab2-bed-start-burn', { start: 0, end: 20 }),
        frameRate: 8,
        repeat: 0,
      });
    }

    if (!this.anims.exists('bed-burning-loop')) {
      this.anims.create({
        key: 'bed-burning-loop',
        frames: this.anims.generateFrameNumbers('lab2-bed-burning', { start: 0, end: 6 }),
        frameRate: 5,
        repeat: -1,
      });
    }

    if (!this.anims.exists('bed-end-burn')) {
      this.anims.create({
        key: 'bed-end-burn',
        frames: this.anims.generateFrameNumbers('lab2-bed-end-burn', { start: 0, end: 8 }),
        frameRate: 7,
        repeat: 0,
      });
    }
  }

  private createBedAndPerson() {
    this.bedReflection = this.add
      .image(SECOND_LEVEL_BED_X, SECOND_LEVEL_BED_REFLECTION_Y, 'lab2-bed-and-person')
      .setOrigin(0.5, 0.5)
      .setScale(SECOND_LEVEL_BED_SCALE, SECOND_LEVEL_BED_SCALE)
      .setFlipY(true)
      .setTint(0xa32a2d)
      .setAlpha(SECOND_LEVEL_BED_REFLECTION_ALPHA)
      .setDepth(34.4);

    this.bedImage = this.add
      .image(SECOND_LEVEL_BED_X, SECOND_LEVEL_BED_Y, 'lab2-bed-and-person')
      .setOrigin(0.5, 0.5)
      .setScale(SECOND_LEVEL_BED_SCALE)
      .setDepth(29);

    this.bedBurningSprite = this.add
      .sprite(SECOND_LEVEL_BED_X, SECOND_LEVEL_BED_Y, 'lab2-bed-start-burn', 0)
      .setOrigin(0.5, 0.5)
      .setScale(SECOND_LEVEL_BED_BURNING_SCALE)
      .setDepth(29.2)
      .setVisible(false);

    this.subjectAsh = this.add.graphics().setDepth(29.6).setVisible(false);
  }

  private createCarriedAnchor() {
    this.anchorRope = this.add.graphics().setDepth(37.2);
    this.anchor = this.add.container(this.player.x, this.player.y).setDepth(ANCHOR_CARRY_DEPTH);

    this.anchorGlowBack = this.add
      .ellipse(this.anchor.x, this.anchor.y + 6, 190, 96, 0x5eeeff, 0.12)
      .setDepth(34)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.anchorGlowCore = this.add
      .ellipse(this.anchor.x, this.anchor.y + 4, 88, 42, 0xd8ffff, 0.08)
      .setDepth(37)
      .setBlendMode(Phaser.BlendModes.ADD);

    const sprite = this.add
      .sprite(0, 44, 'anchor-idle', 0)
      .setOrigin(0.5, 0.82)
      .setDisplaySize(ANCHOR_SPRITE_WIDTH, ANCHOR_SPRITE_HEIGHT);
    sprite.play('anchor-idle');

    this.anchorSilhouette = this.add
      .sprite(this.anchor.x, this.anchor.y + 44, 'anchor-idle', 0)
      .setOrigin(0.5, 0.82)
      .setDisplaySize(ANCHOR_SPRITE_WIDTH, ANCHOR_SPRITE_HEIGHT)
      .setTint(0x6f2424)
      .setAlpha(0)
      .setDepth(34.6)
      .setBlendMode(Phaser.BlendModes.NORMAL)
      .setVisible(false);
    this.anchorSilhouette.play('anchor-idle');

    this.anchor.add(sprite);
    this.updateCarriedAnchor(false);
  }

  private updateCarriedAnchor(moving: boolean) {
    this.anchorRope.clear();
    this.anchor.setDepth(ANCHOR_CARRY_DEPTH);
    const hand = this.getCarrierHandPoint(this.player, this.lastPlayerAnim || 'player-idle');
    const t = this.time.now * 0.001;
    const swayX = moving ? Math.sin(t * 6) * 3 : Math.sin(t * 1.6) * 2;

    this.anchor.setScale(ANCHOR_CARRY_SCALE);
    this.anchor.x = hand.x + swayX;
    this.anchor.y = hand.y + 54 * ANCHOR_CARRY_SCALE;
    this.anchor.setRotation(swayX * 0.006);
    this.updateAnchorGlow();
  }

  private updateDroppedAnchor() {
    this.anchorRope.clear();
    this.anchor.setDepth(ANCHOR_SUBMERGED_DEPTH);
    this.anchor.setScale(0.68);

    const ankle = this.getPlayerAnklePoint();
    const distance = Math.abs(ankle.x - this.anchor.x);
    const tensionStart = TETHER_LENGTH * TETHER_SOFT_ZONE;
    const tension = Phaser.Math.Clamp((distance - tensionStart) / (TETHER_LENGTH - tensionStart), 0, 1);
    const pullDirection = Math.sign(ankle.x - this.anchor.x) || this.facing;
    if (tension > 0.64) {
      playThrottledSfx(this, 'anchor_tension', 0.17, 540, {
        detune: Phaser.Math.Between(-80, 40),
      });
    }
    this.anchor.setRotation(this.getAnchoredHookRotation(pullDirection, tension, this.time.now * 0.001));
    const ring = this.getAnchorRingPoint();
    this.drawAnchorRope(ankle.x, ankle.y, ring.x, ring.y, tension, 0.68);
    this.updateAnchorGlow();
  }

  private updateSubjectBoundAnchor() {
    this.anchorRope.clear();

    if (!this.anchorBindingInProgress) {
      this.anchor.setDepth(ANCHOR_SUBMERGED_DEPTH);
      this.anchor.setScale(0.68);
      this.anchor.setRotation(this.getAnchoredHookRotation(-1, 0.92, this.time.now * 0.001));
      this.anchor.x = SECOND_LEVEL_SUBJECT_ANCHOR_DROP_X;
      this.anchor.y = SECOND_LEVEL_SUBJECT_ANCHOR_DROP_Y;
    }

    const ring = this.getAnchorRingPoint();
    const distance = Phaser.Math.Distance.Between(
      SECOND_LEVEL_SUBJECT_BIND_X,
      SECOND_LEVEL_SUBJECT_BIND_Y,
      ring.x,
      ring.y,
    );
    const tension = Phaser.Math.Clamp(distance / 210, 0.36, 1);
    this.drawAnchorRope(SECOND_LEVEL_SUBJECT_BIND_X, SECOND_LEVEL_SUBJECT_BIND_Y, ring.x, ring.y, tension, 0.78);
    this.updateAnchorGlow();
  }

  private constrainPlayerByDroppedAnchor() {
    const footOffset = this.facing * 8;
    const minX = this.anchor.x - TETHER_LENGTH - footOffset;
    const maxX = this.anchor.x + TETHER_LENGTH - footOffset;
    this.playerWorldX = Phaser.Math.Clamp(this.playerWorldX, minX, maxX);
  }

  private getPlayerAnklePoint() {
    return {
      x: this.playerWorldX + this.facing * 8,
      y: ANKLE_TIE_Y,
    };
  }

  private getAnchorRingPoint() {
    const localX = 0;
    const localY = -54 * this.anchor.scaleY;
    const rotation = this.anchor.rotation;
    return {
      x: this.anchor.x + localX * Math.cos(rotation) - localY * Math.sin(rotation),
      y: this.anchor.y + localX * Math.sin(rotation) + localY * Math.cos(rotation),
    };
  }

  private getAnchoredHookRotation(pullDirection: number, tension: number, phase: number) {
    const direction = pullDirection >= 0 ? 1 : -1;
    const bite = Phaser.Math.SmoothStep(tension, 0, 1);
    const idleRock = Math.sin(phase * 1.6 + this.anchor.x * 0.01) * ANCHOR_HOOK_ROTATION_IDLE * (1 - bite);
    return direction * Phaser.Math.Linear(ANCHOR_HOOK_ROTATION_IDLE, ANCHOR_HOOK_ROTATION_MAX, bite) + idleRock;
  }

  private drawAnchorRope(x1: number, y1: number, x2: number, y2: number, tension: number, alpha: number) {
    const slack = 1 - tension;
    const midX = (x1 + x2) * 0.5;
    const midY = (y1 + y2) * 0.5 + slack * 26;
    const lineAlpha = alpha * Phaser.Math.Linear(0.52, 1, tension);
    const lineWidth = Phaser.Math.Linear(2, 3.4, tension);

    this.anchorRope.lineStyle(lineWidth + 2, 0x1b0508, lineAlpha * 0.42);
    this.anchorRope.beginPath();
    this.anchorRope.moveTo(x1, y1);
    this.anchorRope.lineTo(midX, midY + 2);
    this.anchorRope.lineTo(x2, y2);
    this.anchorRope.strokePath();

    this.anchorRope.lineStyle(lineWidth, tension > 0.55 ? 0xffb2ac : 0xc06c68, lineAlpha);
    this.anchorRope.beginPath();
    this.anchorRope.moveTo(x1, y1);
    this.anchorRope.lineTo(midX, midY);
    this.anchorRope.lineTo(x2, y2);
    this.anchorRope.strokePath();

    this.drawRopeHinge(x1, y1, x2, y2, tension, 5.4, 0xbe6b62, 0xffd2cc);
    this.drawRopeHinge(x2, y2, x1, y1, tension, 7.2, 0xbe6b62, 0xffd2cc);
  }

  private drawRopeHinge(
    x: number,
    y: number,
    towardX: number,
    towardY: number,
    tension: number,
    radius: number,
    metalColor: number,
    highlightColor: number,
  ) {
    const angle = Phaser.Math.Angle.Between(x, y, towardX, towardY);
    const alpha = 0.36 + tension * 0.44;
    const lugLength = radius * 1.25;
    const lugWidth = Phaser.Math.Clamp(radius * 0.46, 2.4, 3.6);
    const lugEndX = x + Math.cos(angle) * lugLength;
    const lugEndY = y + Math.sin(angle) * lugLength;

    this.anchorRope.lineStyle(lugWidth + 2, 0x1b0508, alpha * 0.55);
    this.anchorRope.lineBetween(x, y, lugEndX, lugEndY);
    this.anchorRope.lineStyle(lugWidth, metalColor, alpha);
    this.anchorRope.lineBetween(x, y, lugEndX, lugEndY);

    this.anchorRope.fillStyle(0x1b0508, alpha * 0.5);
    this.anchorRope.fillCircle(x + 1.5, y + 2, radius + 2.4);
    this.anchorRope.fillStyle(0x321316, alpha * 0.82);
    this.anchorRope.fillCircle(x, y, radius + 1.4);
    this.anchorRope.lineStyle(1.4, metalColor, alpha);
    this.anchorRope.strokeCircle(x, y, radius + 1.4);
    this.anchorRope.fillStyle(0x130305, 0.72);
    this.anchorRope.fillCircle(x, y, radius * 0.46);

    this.anchorRope.lineStyle(1, highlightColor, 0.22 + tension * 0.36);
    this.anchorRope.beginPath();
    this.anchorRope.arc(x - radius * 0.24, y - radius * 0.28, radius * 0.72, Math.PI * 1.05, Math.PI * 1.72, false);
    this.anchorRope.strokePath();

    this.anchorRope.fillStyle(highlightColor, 0.28 + tension * 0.18);
    this.anchorRope.fillCircle(x - radius * 0.28, y - radius * 0.34, Math.max(1, radius * 0.18));
  }

  private getCarrierHandPoint(sprite: Phaser.GameObjects.Sprite, animKey: string) {
    const markers = PLAYER_HAND_MARKERS[animKey] ?? PLAYER_HAND_MARKERS['player-idle'];
    const frameIndex = sprite.anims.currentFrame ? sprite.anims.currentFrame.index : 0;
    const safeIndex = ((frameIndex % markers.length) + markers.length) % markers.length;
    const marker = markers[safeIndex];
    const dir = sprite.flipX ? -1 : 1;

    return {
      x: sprite.x + (marker.x - sprite.displayOriginX) * sprite.scaleX * dir,
      y: sprite.y + (marker.y - sprite.displayOriginY) * sprite.scaleY,
    };
  }

  private updateAnchorGlow() {
    const submerged = Phaser.Math.Clamp((this.anchor.y - WATER_SURFACE_Y + 56) / 120, 0, 1);
    const t = this.time.now * 0.001;
    const pulse = 0.82 + Math.sin(t * 2.2 + this.anchor.x * 0.012) * 0.18;
    this.anchorGlowBack.setVisible(false).setAlpha(0);
    this.anchorGlowCore.setVisible(false).setAlpha(0);

    const silhouetteVisible = !this.anchorCarried && submerged > 0.18;
    this.anchorSilhouette
      .setVisible(silhouetteVisible)
      .setPosition(this.anchor.x, this.anchor.y + 44 * this.anchor.scaleY)
      .setDisplaySize(
        ANCHOR_SPRITE_WIDTH * this.anchor.scaleX * 1.02,
        ANCHOR_SPRITE_HEIGHT * this.anchor.scaleY * 0.9,
      )
      .setRotation(this.anchor.rotation)
      .setAlpha(silhouetteVisible ? Phaser.Math.Linear(0.08, 0.16, submerged) * pulse : 0);
  }

  private createBloodLiquid() {
    this.bloodBase = this.add.graphics().setDepth(31);
    this.bloodTiles = [];
    for (let i = 0; i < SECOND_LEVEL_TILE_COUNT; i += 1) {
      const tile = this.add
        .image(i * WIDTH, WATER_TEXTURE_Y, 'water-reference')
        .setOrigin(0, 0)
        .setDisplaySize(WIDTH, HEIGHT - WATER_TEXTURE_Y)
        .setTint(0x7c1118)
        .setAlpha(0.78)
        .setDepth(32)
        .setBlendMode(Phaser.BlendModes.NORMAL);

      this.bloodTiles.push(tile);
    }

    this.bloodBack = this.add.graphics().setDepth(33);
    this.bloodReflection = this.add.graphics().setDepth(34);
    this.bloodSurface = this.add.graphics().setDepth(35);
    this.bloodFront = this.add.graphics().setDepth(36);
    this.updateBloodLiquid(0, 0, 0);
  }

  private updateBloodLiquid(time: number, _deltaSeconds: number, move: number) {
    const bloodDeltaSeconds = this.getBloodDeltaSeconds(time);
    const currentIntensity = 0;
    const amplitude = 3;
    this.bloodPhase += bloodDeltaSeconds * 0.45;
    this.bloodTilePhase += bloodDeltaSeconds * 0.45;
    this.bloodReflectionPhase += bloodDeltaSeconds;
    this.bloodRipplePhase += bloodDeltaSeconds * 0.42;

    const step = 32;
    const cameraLeft = this.cameras.main.scrollX;

    this.bloodBase.clear();
    this.bloodBack.clear();
    this.bloodReflection.clear();
    this.bloodSurface.clear();
    this.bloodFront.clear();

    this.bloodTiles.forEach((tile, index) => {
      tile.y = WATER_TEXTURE_Y + Math.sin(this.bloodTilePhase + index * 0.7) * 0.28;
      tile.setTint(0x7c1118);
      tile.setAlpha(0.78);
    });

    this.bloodBase.fillStyle(0x250306, 1);
    this.bloodBase.fillRect(0, WATER_SURFACE_Y, SECOND_LEVEL_WIDTH, HEIGHT - WATER_SURFACE_Y);

    this.bloodBack.fillStyle(0x581018, 0.08);
    this.drawBloodFill(this.bloodBack, this.bloodPhase, amplitude, 0x581018, 0.08, HEIGHT + 4, step);
    this.bloodBack.fillStyle(0x110103, 0.1);
    this.bloodBack.fillRect(0, WATER_SURFACE_Y + 150, SECOND_LEVEL_WIDTH, HEIGHT - WATER_SURFACE_Y);
    this.bloodBack.fillStyle(0x050001, 0.16);
    this.bloodBack.fillRect(0, HEIGHT - 72, SECOND_LEVEL_WIDTH, 72);
    this.drawBloodDepthBands(this.bloodReflectionPhase);

    this.updateBedReflection(this.bloodReflectionPhase);
    this.drawBloodReflections(this.bloodReflectionPhase, currentIntensity);

    this.drawBloodSurfaceLine(this.bloodPhase, amplitude, step);
    this.drawBloodRippleLayers(this.bloodSurface, BLOOD_SURFACE_RIPPLE_LAYERS, this.bloodRipplePhase, cameraLeft, currentIntensity);

    this.bloodFront.fillStyle(0x0d0102, 0.12);
    this.bloodFront.fillRect(0, GROUND_Y + 96, SECOND_LEVEL_WIDTH, HEIGHT - GROUND_Y);
    this.drawBloodRippleLayers(this.bloodFront, BLOOD_FOREGROUND_RIPPLE_LAYERS, this.bloodRipplePhase, cameraLeft, currentIntensity);
    this.drawBloodLegSplashes(bloodDeltaSeconds, move, this.bloodPhase, amplitude);
    this.drawAnchorDropSplash(time, this.bloodPhase, amplitude);
  }

  private updateBedReflection(t: number) {
    this.bedReflection
      .setY(SECOND_LEVEL_BED_REFLECTION_Y + Math.sin(t * 0.72) * 2.5)
      .setAlpha(SECOND_LEVEL_BED_REFLECTION_ALPHA + Math.sin(t * 0.9) * 0.035);
  }

  private drawBloodFill(
    graphics: Phaser.GameObjects.Graphics,
    t: number,
    amplitude: number,
    color: number,
    alpha: number,
    bottomY: number,
    step: number,
  ) {
    graphics.fillStyle(color, alpha);
    graphics.beginPath();
    graphics.moveTo(0, bottomY);
    graphics.lineTo(0, this.getBloodY(0, t, amplitude));

    for (let x = 0; x <= SECOND_LEVEL_WIDTH + step; x += step) {
      graphics.lineTo(x, this.getBloodY(x, t, amplitude));
    }

    graphics.lineTo(SECOND_LEVEL_WIDTH, bottomY);
    graphics.closePath();
    graphics.fillPath();
  }

  private getBloodDeltaSeconds(time: number) {
    if (this.lastBloodUpdateTime === null) {
      this.lastBloodUpdateTime = time;
      return 0;
    }

    const deltaSeconds = Phaser.Math.Clamp((time - this.lastBloodUpdateTime) / 1000, 0, 0.05);
    this.lastBloodUpdateTime = time;
    return deltaSeconds;
  }

  private drawBloodDepthBands(t: number) {
    this.bloodBack.fillStyle(0x080001, 0.18);
    this.bloodBack.fillRect(0, WATER_SURFACE_Y + 118, SECOND_LEVEL_WIDTH, HEIGHT - WATER_SURFACE_Y);
    this.bloodBack.fillStyle(0x020000, 0.26);
    this.bloodBack.fillRect(0, HEIGHT - 86, SECOND_LEVEL_WIDTH, 86);

    for (let tile = 0; tile < SECOND_LEVEL_TILE_COUNT; tile += 1) {
      const baseX = tile * WIDTH;
      for (const x of [136, 310, 476, 790, 1034, 1198]) {
        const width = x === 790 ? 70 : 34;
        const height = 190 + this.bloodNoise(tile + x * 0.03) * 120;
        const drift = Math.sin(t * 0.42 + tile + x * 0.01) * 7;
        this.drawBloodReflectionColumn(
          this.bloodBack,
          baseX + x + drift,
          WATER_SURFACE_Y + 18,
          width,
          height,
          0x050001,
          0.12 + this.bloodNoise(tile + x) * 0.08,
          t,
          tile + x * 0.02,
        );
      }
    }
  }

  private drawBloodReflections(t: number, currentIntensity: number) {
    const lightAlpha = Phaser.Math.Linear(0.13, 0.18, currentIntensity);
    const darkAlpha = Phaser.Math.Linear(0.16, 0.22, currentIntensity);

    for (let tile = 0; tile < SECOND_LEVEL_TILE_COUNT; tile += 1) {
      const baseX = tile * WIDTH;
      this.drawBloodLightPool(baseX + 690, WATER_SURFACE_Y + 108, 420, 118, 0x6a1118, 0.08, t, tile + 0.2);
      this.drawBloodLightPool(baseX + 980, WATER_SURFACE_Y + 220, 520, 155, 0x3c070b, 0.1, t, tile + 1.8);
      this.drawBloodLightPool(baseX + 420, WATER_SURFACE_Y + 268, 360, 105, 0xa42b2a, 0.045, t, tile + 2.9);

      this.drawBloodReflectionColumn(
        this.bloodReflection,
        baseX + 736,
        WATER_SURFACE_Y + 18,
        42,
        150,
        0xffb09c,
        lightAlpha * 0.62,
        t,
        tile + 0.6,
        currentIntensity,
      );
      this.drawBloodReflectionColumn(
        this.bloodReflection,
        baseX + 918,
        WATER_SURFACE_Y + 22,
        86,
        224,
        0xe05f52,
        lightAlpha,
        t,
        tile + 1.4,
        currentIntensity,
      );
      this.drawBloodReflectionColumn(
        this.bloodReflection,
        baseX + 636,
        WATER_SURFACE_Y + 16,
        12,
        270,
        0xff4e4d,
        Phaser.Math.Linear(0.13, 0.2, currentIntensity),
        t,
        tile + 2.1,
        currentIntensity,
      );
      this.drawBloodReflectionColumn(
        this.bloodReflection,
        baseX + SECOND_LEVEL_BED_X - WIDTH,
        WATER_SURFACE_Y + 10,
        180,
        310,
        0xca352f,
        0.16,
        t,
        tile + 4.4,
        currentIntensity,
      );

      this.drawBloodSpecularStreaks(
        baseX + 735,
        WATER_SURFACE_Y + 170,
        92,
        0xffb5a4,
        Phaser.Math.Linear(0.09, 0.14, currentIntensity),
        t,
        tile + 3.2,
        currentIntensity,
      );
      this.drawBloodSpecularStreaks(
        baseX + 930,
        WATER_SURFACE_Y + 210,
        112,
        0xd65c51,
        Phaser.Math.Linear(0.08, 0.13, currentIntensity),
        t,
        tile + 4.1,
        currentIntensity,
      );
      this.drawBloodSpecularStreaks(
        baseX + 918,
        WATER_SURFACE_Y + 288,
        88,
        0x9f312f,
        Phaser.Math.Linear(0.07, 0.11, currentIntensity),
        t,
        tile + 4.8,
        currentIntensity,
      );

      for (const x of [170, 264, 300, 400, 610, 760, 1124, 1218]) {
        this.drawBloodReflectionColumn(
          this.bloodReflection,
          baseX + x,
          WATER_SURFACE_Y + 6,
          x === 610 ? 50 : 24,
          230,
          0x030001,
          darkAlpha,
          t,
          tile + x * 0.01,
          currentIntensity,
        );
      }
    }
  }

  private drawBloodLightPool(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    alpha: number,
    t: number,
    phase: number,
  ) {
    const bands = 3;
    for (let i = 0; i < bands; i += 1) {
      const seed = phase * 31.7 + i * 19.9;
      const progress = i / (bands - 1);
      const bandWidth = width * Phaser.Math.Linear(0.35, 0.92, this.bloodNoise(seed));
      const bandHeight = Phaser.Math.Linear(4, 12, this.bloodNoise(seed + 1.4));
      const bandX = x - bandWidth / 2 + this.signedBloodNoise(seed + 2.6) * width * 0.28;
      const bandY = y + progress * height + this.signedBloodNoise(seed + 3.9) * 18;
      this.drawBloodPatch(
        bandX,
        bandY,
        bandWidth,
        bandHeight,
        alpha * Phaser.Math.Linear(0.36, 1, this.bloodNoise(seed + 5.2)),
        t * 0.68,
        seed,
        color,
        this.bloodReflection,
      );
    }
  }

  private drawBloodReflectionColumn(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    alpha: number,
    t: number,
    phase: number,
    currentIntensity = 0,
  ) {
    const segmentHeight = Phaser.Math.Linear(3.2, 5.5, currentIntensity);
    const gap = Phaser.Math.Linear(18, 13, currentIntensity);
    const driftAmount = Phaser.Math.Linear(10, 18, currentIntensity);

    for (let offsetY = 0; offsetY < height;) {
      const progress = offsetY / height;
      const seed = phase * 47.3 + offsetY * 3.1;
      if (this.bloodNoise(seed + 1.7) < 0.14) {
        offsetY += gap * Phaser.Math.Linear(0.8, 1.5, this.bloodNoise(seed + 2.2));
        continue;
      }
      const shimmer = 0.72 + Math.sin(t + phase + offsetY * 0.08) * 0.24;
      const localHeight = segmentHeight * Phaser.Math.Linear(0.7, 1.75, this.bloodNoise(seed + 3.4));
      const segmentWidth = Math.max(10, width * (1 - progress * 0.72) * shimmer * Phaser.Math.Linear(0.62, 1.35, this.bloodNoise(seed + 4.8)));
      const drift =
        Math.sin(t * 0.8 + phase + offsetY * 0.045) * driftAmount +
        this.signedBloodNoise(seed + 5.1) * width * 0.22;
      this.drawBloodPatch(
        x - segmentWidth / 2 + drift,
        y + offsetY,
        segmentWidth,
        localHeight,
        alpha * (1 - progress * 0.78) * Phaser.Math.Linear(0.55, 1.08, this.bloodNoise(seed + 6.5)),
        t,
        phase + offsetY * 0.02,
        color,
        graphics,
      );
      offsetY += localHeight + gap * Phaser.Math.Linear(0.7, 1.65, this.bloodNoise(seed + 7.7));
    }
  }

  private drawBloodSpecularStreaks(
    x: number,
    y: number,
    width: number,
    color: number,
    alpha: number,
    t: number,
    phase: number,
    currentIntensity: number,
  ) {
    const count = 2 + Math.floor(this.bloodNoise(phase + 2.7) * 3);
    let offsetY = 0;
    for (let i = 0; i < count; i += 1) {
      const seed = phase * 23.1 + i * 11.6;
      const segmentWidth = width * Phaser.Math.Linear(0.28, 0.86, this.bloodNoise(seed + 1.3));
      const segmentX =
        x - segmentWidth / 2 +
        Math.sin(t + phase + i) * Phaser.Math.Linear(8, 18, currentIntensity) +
        this.signedBloodNoise(seed + 2.9) * width * 0.28;
      const segmentY = y + offsetY + Math.cos(t * 0.8 + phase + i) * 2 + this.signedBloodNoise(seed + 4.1) * 7;
      this.drawBloodPatch(
        segmentX,
        segmentY,
        segmentWidth,
        Phaser.Math.Linear(2.4, 5.8, this.bloodNoise(seed + 5.4)),
        alpha * (1 - i * 0.1) * Phaser.Math.Linear(0.58, 1.2, this.bloodNoise(seed + 6.8)),
        t,
        seed,
        color,
        this.bloodReflection,
      );
      offsetY += Phaser.Math.Linear(16, 34, this.bloodNoise(seed + 8.2));
    }
  }

  private drawBloodSurfaceLine(t: number, amplitude: number, step: number) {
    this.bloodSurface.lineStyle(2, 0xff9f91, 0.68);
    this.bloodSurface.beginPath();
    this.bloodSurface.moveTo(0, this.getBloodY(0, t, amplitude));
    for (let x = 0; x <= SECOND_LEVEL_WIDTH + step; x += step) {
      this.bloodSurface.lineTo(x, this.getBloodY(x, t, amplitude));
    }
    this.bloodSurface.strokePath();

    this.bloodSurface.lineStyle(1, 0xba4a43, 0.34);
    this.bloodSurface.beginPath();
    this.bloodSurface.moveTo(0, this.getBloodY(0, t + 0.38, amplitude * 0.64) + 9);
    for (let x = 0; x <= SECOND_LEVEL_WIDTH + step; x += step) {
      this.bloodSurface.lineTo(x, this.getBloodY(x, t + 0.38, amplitude * 0.64) + 9);
    }
    this.bloodSurface.strokePath();
  }

  private drawBloodRippleLayers(
    graphics: Phaser.GameObjects.Graphics,
    layers: RippleLayer[],
    t: number,
    cameraLeft: number,
    currentIntensity: number,
  ) {
    const left = cameraLeft - 140;
    const right = cameraLeft + WIDTH + 140;
    const rippleT = t;

    layers.forEach((layer, layerIndex) => {
      for (let band = 0; band < layer.bands; band += 1) {
        const baseSpacing =
          layer.spacing + Math.sin(layerIndex * 1.7 + band * 0.9) * layer.spacingJitter;
        const spacing = Math.max(180, baseSpacing * Phaser.Math.Linear(1, 1.06, currentIntensity));
        const offset = (layerIndex * 113 + band * 67 + rippleT * layer.driftSpeed) % spacing;
        const baseY =
          layer.yStart +
          band * layer.bandGap +
          Math.sin(rippleT * 0.45 + band * 0.8 + layerIndex) * layer.yWave;
        const depth = Phaser.Math.Clamp((baseY - WATER_SURFACE_Y) / (HEIGHT - WATER_SURFACE_Y), 0, 1);

        const firstSlot = Math.floor((left - offset) / spacing) - 2;
        const lastSlot = Math.ceil((right - offset) / spacing) + 2;

        for (let slot = firstSlot; slot <= lastSlot; slot += 1) {
          const seed = layerIndex * 219.7 + band * 61.3 + slot * 37.9;
          if (this.bloodNoise(seed + 9.5) < 0.58) continue;

          const x = offset + slot * spacing;
          const segmentX = x + this.signedBloodNoise(seed + 1.1) * spacing * 0.38;
          if (segmentX < left - spacing || segmentX > right + spacing) continue;

          const segmentY =
            baseY +
            this.signedBloodNoise(seed + 2.3) * layer.yWave * Phaser.Math.Linear(1.4, 3, currentIntensity) +
            this.signedBloodNoise(seed + 2.95) * 7;
          const lengthScale =
            Phaser.Math.Linear(0.72, 2.25, this.bloodNoise(seed + 3.7)) *
            Phaser.Math.Linear(1, 1.35 + depth * 0.45, currentIntensity);
          const width = Math.max(26, (layer.length + this.signedBloodNoise(seed + 4.4) * layer.lengthJitter) * lengthScale);
          const alphaNoise = 0.58 + this.bloodNoise(seed + 5.6) * 0.58;
          const alpha = Phaser.Math.Linear(layer.alpha, layer.currentAlpha, currentIntensity) * alphaNoise;
          const lineWidth =
            Math.max(0.9, layer.lineWidth + this.signedBloodNoise(seed + 6.9) * 0.72) *
            Phaser.Math.Linear(0.9, 1.45 + depth * 0.35, currentIntensity);
          const bend =
            layer.bend *
            Phaser.Math.Linear(0.55, 2.15, this.bloodNoise(seed + 8.2)) *
            Phaser.Math.Linear(1, 1.38, currentIntensity);
          const shape = this.pickBloodRippleShape(layer.shape, seed);

          graphics.lineStyle(lineWidth, layer.color, alpha);
          this.drawBloodRippleSegment(graphics, segmentX, segmentY, width, bend, shape, rippleT, seed);

          if (this.bloodNoise(seed + 16.2) > 0.82) {
            graphics.lineStyle(lineWidth * 0.5, layer.color, alpha * 0.42);
            this.drawBloodRippleSegment(
              graphics,
              segmentX + width * Phaser.Math.Linear(0.18, 0.52, this.bloodNoise(seed + 17.5)),
              segmentY + this.signedBloodNoise(seed + 18.3) * 11,
              width * Phaser.Math.Linear(0.22, 0.46, this.bloodNoise(seed + 19.4)),
              bend * 0.7,
              'broken',
              rippleT,
              seed + 21.1,
            );
          }
        }
      }
    });
  }

  private pickBloodRippleShape(baseShape: RippleShape, seed: number): RippleShape {
    const noise = this.bloodNoise(seed + 10.7);
    if (noise < 0.16) return 'short';
    if (noise < 0.38) return 'broken';
    if (noise < 0.68) return baseShape;
    return noise < 0.86 ? 'thread' : 'swell';
  }

  private drawBloodRippleSegment(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    bend: number,
    shape: RippleShape,
    t: number,
    phase: number,
  ) {
    const pointCount = shape === 'short' ? 3 : 4 + Math.floor(this.bloodNoise(phase + 11.4) * 5);
    const splitAt = 1 + Math.floor(this.bloodNoise(phase + 12.9) * Math.max(1, pointCount - 1));
    const shouldSplit = shape === 'broken' || this.bloodNoise(phase + 13.6) < 0.3;
    const skew = this.signedBloodNoise(phase + 14.1) * width * 0.14;
    const tempo = Phaser.Math.Linear(0.12, 0.32, this.bloodNoise(phase + 15.2));
    const shapeBend = shape === 'swell' ? bend * 1.55 : shape === 'thread' ? bend * 0.82 : bend;

    graphics.beginPath();
    let drawing = false;

    for (let point = 0; point <= pointCount; point += 1) {
      if (shouldSplit && point === splitAt) {
        drawing = false;
        continue;
      }

      const progress = point / pointCount;
      const taper = Math.sin(progress * Math.PI);
      const pointSeed = phase + point * 17.3;
      const px = x + width * progress + skew * progress + this.signedBloodNoise(pointSeed) * width * 0.035;
      const wave =
        Math.sin(t * tempo + phase + progress * Phaser.Math.Linear(1.6, 4.4, this.bloodNoise(pointSeed + 1.9))) *
        shapeBend *
        taper;
      const py = y + wave + this.signedBloodNoise(pointSeed + 2.6) * shapeBend * 0.45;

      if (!drawing) {
        graphics.moveTo(px, py);
        drawing = true;
      } else {
        graphics.lineTo(px, py);
      }
    }

    graphics.strokePath();
  }

  private drawBloodLegSplashes(deltaSeconds: number, move: number, t: number, bloodAmplitude: number) {
    if (move === 0 || deltaSeconds <= 0) return;

    const splashStrength = 0.72;
    this.bloodSplashPhase += deltaSeconds * 7.2;

    const direction = Math.sign(move);
    const wakeDirection = direction > 0 ? -1 : 1;

    LEG_SPLASH_OFFSETS.forEach((offset, legIndex) => {
      const legPhase = this.bloodSplashPhase + legIndex * Math.PI;
      const footfall = 0.5 + Math.sin(legPhase) * 0.5;
      const contact = 0.45 + footfall * 0.55;
      const legX = this.player.x + offset;
      const surfaceY = this.getBloodY(legX, t, bloodAmplitude) + 4;
      const stepIndex = Math.floor(legPhase / Math.PI);
      const seed = legIndex * 101.7 + stepIndex * 23.3;
      const strength = splashStrength * contact;

      this.drawBloodFootRipple(legX, surfaceY, strength, seed);
      this.drawBloodFootTrail(legX, surfaceY + 3, wakeDirection, strength, seed + 31.4);

      if (footfall > 0.35) {
        this.drawBloodFootSpray(legX, surfaceY - 1, direction, splashStrength * footfall, seed + 53.8);
      }
    });
  }

  private drawAnchorDropSplash(time: number, t: number, bloodAmplitude: number) {
    if (time >= this.anchorDropSplashUntil) return;

    const progress = 1 - (this.anchorDropSplashUntil - time) / 900;
    const strength = 1 - progress;
    const x = SECOND_LEVEL_SUBJECT_ANCHOR_DROP_X;
    const y = this.getBloodY(x, t, bloodAmplitude) + 8;
    const width = Phaser.Math.Linear(34, 150, progress);
    const alpha = 0.42 * strength;

    this.bloodSurface.lineStyle(2.2, 0xff8a78, alpha);
    this.bloodSurface.strokeEllipse(x, y, width, 10 + progress * 10);

    this.bloodFront.lineStyle(1.2, 0xd34a46, alpha * 0.85);
    this.bloodFront.beginPath();
    this.bloodFront.moveTo(x - width * 0.42, y + 6);
    this.bloodFront.lineTo(x - width * 0.16, y + 1 + Math.sin(t * 2.1) * 2);
    this.bloodFront.lineTo(x + width * 0.18, y + 5);
    this.bloodFront.lineTo(x + width * 0.45, y + Math.sin(t * 1.8) * 3);
    this.bloodFront.strokePath();

    for (let i = 0; i < 8; i += 1) {
      const angle = -Math.PI + (Math.PI * i) / 7;
      const sprayX = x + Math.cos(angle) * Phaser.Math.Linear(8, 36, progress);
      const sprayY = y - Math.sin(angle) * Phaser.Math.Linear(8, 24, strength);
      this.bloodFront.lineStyle(0.8, 0xf06c61, alpha * 0.7);
      this.bloodFront.lineBetween(sprayX, sprayY, sprayX + Math.cos(angle) * 8, sprayY - 8 * strength);
    }
  }

  private drawBloodFootRipple(x: number, y: number, strength: number, seed: number) {
    const width = Phaser.Math.Linear(22, 58, strength) * Phaser.Math.Linear(0.78, 1.18, this.bloodNoise(seed));
    const height = Phaser.Math.Linear(4, 11, strength);
    const alpha = 0.24 + strength * 0.38;

    this.bloodFront.lineStyle(1.3 + strength, 0xda5956, alpha);
    this.bloodFront.beginPath();
    this.bloodFront.moveTo(x - width * 0.48, y + this.signedBloodNoise(seed + 1.1) * height);
    this.bloodFront.lineTo(x - width * 0.18, y - height * 0.32);
    this.bloodFront.moveTo(x - width * 0.05, y + height * 0.22);
    this.bloodFront.lineTo(x + width * 0.34, y - height * 0.2);
    this.bloodFront.lineTo(x + width * 0.5, y + this.signedBloodNoise(seed + 2.2) * height * 0.42);
    this.bloodFront.strokePath();

    this.bloodSurface.lineStyle(1, 0xff9d91, alpha * 0.5);
    this.bloodSurface.beginPath();
    this.bloodSurface.moveTo(x - width * 0.28, y - 2);
    this.bloodSurface.lineTo(x + width * 0.28, y - 2 + this.signedBloodNoise(seed + 3.3) * 1.3);
    this.bloodSurface.strokePath();
  }

  private drawBloodFootTrail(x: number, y: number, wakeDirection: number, strength: number, seed: number) {
    const length = Phaser.Math.Linear(24, 76, strength) * Phaser.Math.Linear(0.8, 1.16, this.bloodNoise(seed + 1.7));
    const startX = wakeDirection > 0 ? x : x - length;
    const alpha = 0.18 + strength * 0.22;

    this.drawBloodPatch(
      startX,
      y + this.signedBloodNoise(seed + 2.5) * 2,
      length,
      Phaser.Math.Linear(1.4, 3.2, strength),
      alpha,
      this.bloodSplashPhase,
      seed,
    );
  }

  private drawBloodFootSpray(x: number, y: number, direction: number, strength: number, seed: number) {
    const dropletCount = 3 + Math.floor(strength * 6);

    for (let i = 0; i < dropletCount; i += 1) {
      const dropSeed = seed + i * 9.1;
      const side = this.signedBloodNoise(dropSeed);
      const startX = x + side * Phaser.Math.Linear(4, 18, this.bloodNoise(dropSeed + 1.2));
      const startY = y + this.signedBloodNoise(dropSeed + 2.4) * 3;
      const height = Phaser.Math.Linear(6, 22, this.bloodNoise(dropSeed + 3.8)) * strength;
      const lean = direction * Phaser.Math.Linear(3, 13, this.bloodNoise(dropSeed + 4.6)) * strength;
      const alpha = Phaser.Math.Linear(0.18, 0.58, strength) * Phaser.Math.Linear(0.55, 1, this.bloodNoise(dropSeed + 5.1));

      this.bloodFront.lineStyle(0.9 + strength * 0.85, 0xf07268, alpha);
      this.bloodFront.beginPath();
      this.bloodFront.moveTo(startX, startY);
      this.bloodFront.lineTo(startX - lean + side * 3, startY - height);
      this.bloodFront.strokePath();
    }
  }

  private drawBloodPatch(
    x: number,
    y: number,
    width: number,
    height: number,
    alpha: number,
    t: number,
    phase: number,
    color = 0xb73333,
    graphics?: Phaser.GameObjects.Graphics,
  ) {
    const target = graphics ?? this.bloodFront;
    const segments = 5;
    target.fillStyle(color, alpha);
    target.beginPath();
    target.moveTo(x, y + Math.sin(t * 0.9 + phase) * 1.2);

    for (let i = 1; i <= segments; i += 1) {
      const px = x + (width * i) / segments;
      target.lineTo(px, y + Math.sin(t * 0.9 + phase + i * 0.8) * 1.4);
    }

    for (let i = segments; i >= 0; i -= 1) {
      const px = x + (width * i) / segments;
      target.lineTo(px, y + height + Math.sin(t * 1.05 + phase + i * 0.7) * 1.4);
    }

    target.closePath();
    target.fillPath();
  }

  private bloodNoise(seed: number) {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  }

  private signedBloodNoise(seed: number) {
    return this.bloodNoise(seed) * 2 - 1;
  }

  private getBloodY(x: number, t: number, amplitude: number) {
    return (
      WATER_SURFACE_Y +
      Math.sin(x * 0.018 + t) * amplitude +
      Math.sin(x * 0.047 - t * 1.7) * amplitude * 0.36
    );
  }

  private createControls() {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input is required for this prototype.');
    }

    this.cursors = keyboard.createCursorKeys();
    this.keys = createGameKeyMap(this);
  }

  private handleLevelHotkeys() {
    navigateByLevelHotkey(this, this.keys);
  }

  private setPlayerAnim(key: string) {
    if (this.lastPlayerAnim === key) return;
    this.player.play(key, true);
    this.applyCharacterPose(this.player, key);
    this.lastPlayerAnim = key;
  }

  private applyCharacterPose(sprite: Phaser.GameObjects.Sprite, animKey: string) {
    const isWalking = animKey === 'player-walk';
    sprite.setDisplayOrigin(isWalking ? WALK_ORIGIN.x : IDLE_ORIGIN.x, isWalking ? WALK_ORIGIN.y : IDLE_ORIGIN.y);
    if (isWalking) {
      sprite.setScale(PLAYER_WALK_SCALE_X, PLAYER_WALK_SCALE_Y);
    } else {
      sprite.setScale(PLAYER_IDLE_SCALE);
    }
  }

  private distanceTo(x: number, y: number) {
    return Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y);
  }
}

class ThirdLevelScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private anchor!: Phaser.GameObjects.Container;
  private anchorRope!: Phaser.GameObjects.Graphics;
  private anchorGlowBack!: Phaser.GameObjects.Ellipse;
  private anchorGlowCore!: Phaser.GameObjects.Ellipse;
  private anchorSilhouette!: Phaser.GameObjects.Sprite;
  private tableComputer!: Phaser.GameObjects.Image;
  private blackLiquidBack!: Phaser.GameObjects.Graphics;
  private blackLiquidFront!: Phaser.GameObjects.Graphics;
  private promptText!: Phaser.GameObjects.Text;
  private dialoguePanel!: Phaser.GameObjects.Container;
  private dialogueSpeakerText!: Phaser.GameObjects.Text;
  private dialogueBodyText!: Phaser.GameObjects.Text;
  private dialogueHintText!: Phaser.GameObjects.Text;
  private confirmPanel!: Phaser.GameObjects.Container;
  private entryOverlay!: Phaser.GameObjects.Rectangle;
  private glitchOverlay!: Phaser.GameObjects.Rectangle;
  private glitchLayer!: Phaser.GameObjects.Graphics;
  private crtSwitchLayer!: Phaser.GameObjects.Graphics;
  private laughImage!: Phaser.GameObjects.Image;
  private laughRed!: Phaser.GameObjects.Image;
  private laughCyan!: Phaser.GameObjects.Image;
  private laughStickers: Phaser.GameObjects.Text[] = [];
  private finalBlack!: Phaser.GameObjects.Rectangle;
  private finalText!: Phaser.GameObjects.Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: GameKeyMap;
  private playerWorldX = THIRD_LEVEL_PLAYER_START_X;
  private facing = 1;
  private lastPlayerAnim = '';
  private phase: ThirdLevelPhase = 'intro';
  private anchorCarried = true;
  private anchorBoundToComputer = false;
  private dialogueLines: DialogueLine[] = [];
  private dialogueIndex = 0;
  private dialogueActive = false;
  private dialogueInputConsumed = false;
  private dialogueCompleteHandler: (() => void) | null = null;
  private confirmVisible = false;
  private glitchStartedAt = 0;
  private crtSwitchStartedAt = 0;
  private roomPhase = 0;

  constructor() {
    super('ThirdLevelScene');
  }

  preload() {
    loadGameAssets(this);
  }

  create(data?: { fromCompletionTransition?: boolean }) {
    ensureCoreAnimations(this);
    this.resetThirdLevelState();

    this.add.rectangle(THIRD_LEVEL_WIDTH / 2, HEIGHT / 2, THIRD_LEVEL_WIDTH, HEIGHT, 0x000000).setDepth(0);
    this.createBlackRoom();
    this.createBlackLiquid();

    this.player = this.physics.add.sprite(this.playerWorldX, GROUND_Y, 'hero-idle', 0);
    this.player.setDepth(28);
    this.player.setCollideWorldBounds(true);
    this.player.body?.setSize(160, 360);
    this.setPlayerAnim('player-idle');

    this.createThirdLevelAnchor();

    this.createPrompt();
    this.createDialoguePanel();
    this.createConfirmPanel();
    this.createGlitchLayers();
    this.createControls();
    playMusic(this, 'amb_black_room', 0.26);

    this.cameras.main.setBounds(0, 0, THIRD_LEVEL_WIDTH, HEIGHT);
    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.cameras.main.roundPixels = true;
    this.physics.world.setBounds(0, 0, THIRD_LEVEL_WIDTH, HEIGHT);

    this.entryOverlay = this.add
      .rectangle(0, 0, WIDTH, HEIGHT, 0x000000, 1)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(220)
      .setAlpha(data?.fromCompletionTransition ? 1 : 0)
      .setVisible(Boolean(data?.fromCompletionTransition));

    if (data?.fromCompletionTransition) {
      this.time.delayedCall(360, () => {
        this.tweens.add({
          targets: this.entryOverlay,
          alpha: 0,
          duration: 900,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            this.entryOverlay.setVisible(false);
            this.startIntroDialogue();
          },
        });
      });
    } else {
      this.time.delayedCall(260, () => this.startIntroDialogue());
    }
  }

  update(time: number, delta: number) {
    this.dialogueInputConsumed = false;
    this.updateDialogueInput();
    this.handleLevelHotkeys();

    const deltaSeconds = Math.min(delta, 50) / 1000;
    this.roomPhase += deltaSeconds;
    this.updateBlackRoom();
    this.drawBlackLiquid();
    this.updateGlitchEffect(time);

    let move = 0;
    if (this.cursors.left?.isDown || this.keys.a.isDown) move -= 1;
    if (this.cursors.right?.isDown || this.keys.d.isDown) move += 1;
    if (
      this.phase === 'intro' ||
      this.phase === 'bindingAnchor' ||
      this.phase === 'glitch' ||
      this.phase === 'ending' ||
      this.dialogueActive ||
      this.confirmVisible
    ) {
      move = 0;
    }

    this.playerWorldX = Phaser.Math.Clamp(
      this.playerWorldX + move * SECOND_LEVEL_PLAYER_SPEED * deltaSeconds,
      120,
      THIRD_LEVEL_WIDTH - 120,
    );
    if (!this.anchorCarried && !this.anchorBoundToComputer) {
      this.constrainThirdLevelPlayerByDroppedAnchor();
    }
    this.player.x = Math.round(this.playerWorldX);
    this.player.y = GROUND_Y;
    this.player.setVelocity(0, 0);

    if (move !== 0) {
      this.facing = move > 0 ? 1 : -1;
      this.player.setFlipX(this.facing < 0);
      this.setPlayerAnim('player-walk');
    } else {
      this.setPlayerAnim('player-idle');
    }
    setLoopingSfx(this, 'step_black', move !== 0, 0.17, {
      detune: -55,
    });

    this.handleComputerInteraction();
    this.updateAnchor(move !== 0);
    this.updatePrompt();
  }

  private resetThirdLevelState() {
    this.playerWorldX = THIRD_LEVEL_PLAYER_START_X;
    this.facing = 1;
    this.lastPlayerAnim = '';
    this.phase = 'intro';
    this.anchorCarried = true;
    this.anchorBoundToComputer = false;
    this.dialogueLines = [];
    this.dialogueIndex = 0;
    this.dialogueActive = false;
    this.dialogueInputConsumed = false;
    this.dialogueCompleteHandler = null;
    this.confirmVisible = false;
    this.glitchStartedAt = 0;
    this.roomPhase = 0;
  }

  private createBlackRoom() {
    this.tableComputer = this.add
      .image(THIRD_LEVEL_CENTER_X, THIRD_LEVEL_TABLE_Y, 'scene3-table-computer')
      .setDisplaySize(THIRD_LEVEL_TABLE_WIDTH, THIRD_LEVEL_TABLE_HEIGHT)
      .setDepth(14);
  }

  private createBlackLiquid() {
    this.blackLiquidBack = this.add.graphics().setDepth(11);
    this.blackLiquidFront = this.add.graphics().setDepth(36);
    this.drawBlackLiquid();
  }

  private createThirdLevelAnchor() {
    this.anchorRope = this.add.graphics().setDepth(37.2);
    this.anchor = this.add.container(this.player.x, this.player.y).setDepth(ANCHOR_CARRY_DEPTH);

    this.anchorGlowBack = this.add
      .ellipse(this.anchor.x, this.anchor.y + 6, 190, 96, 0x5eeeff, 0.12)
      .setDepth(34)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.anchorGlowCore = this.add
      .ellipse(this.anchor.x, this.anchor.y + 4, 88, 42, 0xd8ffff, 0.08)
      .setDepth(37)
      .setBlendMode(Phaser.BlendModes.ADD);

    const sprite = this.add
      .sprite(0, 44, 'anchor-idle', 0)
      .setOrigin(0.5, 0.82)
      .setDisplaySize(ANCHOR_SPRITE_WIDTH, ANCHOR_SPRITE_HEIGHT);
    sprite.play('anchor-idle');

    this.anchorSilhouette = this.add
      .sprite(this.anchor.x, this.anchor.y + 44, 'anchor-idle', 0)
      .setOrigin(0.5, 0.82)
      .setDisplaySize(ANCHOR_SPRITE_WIDTH, ANCHOR_SPRITE_HEIGHT)
      .setTint(0x111111)
      .setAlpha(0)
      .setDepth(ANCHOR_UNDERWATER_SILHOUETTE_DEPTH)
      .setBlendMode(Phaser.BlendModes.NORMAL)
      .setVisible(false);
    this.anchorSilhouette.play('anchor-idle');

    this.anchor.add(sprite);
    this.updateThirdLevelCarriedAnchor(false);
  }

  private drawBlackLiquid() {
    const surfaceY = THIRD_LEVEL_LIQUID_SURFACE_Y;
    const t = this.roomPhase;
    const step = 36;

    this.blackLiquidBack.clear();
    this.blackLiquidBack.fillStyle(0x020303, 0.96);
    this.blackLiquidBack.beginPath();
    this.blackLiquidBack.moveTo(0, HEIGHT);
    this.blackLiquidBack.lineTo(0, this.getBlackLiquidY(0, t));
    for (let x = 0; x <= THIRD_LEVEL_WIDTH + step; x += step) {
      this.blackLiquidBack.lineTo(x, this.getBlackLiquidY(x, t));
    }
    this.blackLiquidBack.lineTo(THIRD_LEVEL_WIDTH, HEIGHT);
    this.blackLiquidBack.closePath();
    this.blackLiquidBack.fillPath();

    this.blackLiquidBack.fillStyle(0x000000, 0.42);
    this.blackLiquidBack.fillRect(0, surfaceY + 122, THIRD_LEVEL_WIDTH, HEIGHT - surfaceY);
    this.blackLiquidBack.lineStyle(2.4, 0x5e5547, 0.5);
    this.blackLiquidBack.beginPath();
    this.blackLiquidBack.moveTo(0, this.getBlackLiquidY(0, t));
    for (let x = 0; x <= THIRD_LEVEL_WIDTH + step; x += step) {
      this.blackLiquidBack.lineTo(x, this.getBlackLiquidY(x, t));
    }
    this.blackLiquidBack.strokePath();

    this.blackLiquidBack.lineStyle(1, 0x171512, 0.76);
    this.blackLiquidBack.beginPath();
    this.blackLiquidBack.moveTo(0, this.getBlackLiquidY(0, t + 0.42) + 12);
    for (let x = 0; x <= THIRD_LEVEL_WIDTH + step; x += step) {
      this.blackLiquidBack.lineTo(x, this.getBlackLiquidY(x, t + 0.42) + 12);
    }
    this.blackLiquidBack.strokePath();

    for (let i = 0; i < 7; i += 1) {
      const seed = i * 18.7;
      const width = Phaser.Math.Linear(130, 520, this.glitchNoise(seed + 1.2));
      const x = THIRD_LEVEL_CENTER_X - width / 2 + this.signedGlitchNoise(seed + 2.8) * 210;
      const y = surfaceY + 26 + i * 34 + this.signedGlitchNoise(seed + 4.4) * 10;
      this.blackLiquidBack.fillStyle(i % 2 === 0 ? 0x6a5e4d : 0x2a2620, 0.045 + this.glitchNoise(seed + 6.1) * 0.055);
      this.blackLiquidBack.fillRect(x, y, width, Phaser.Math.Linear(3, 8, this.glitchNoise(seed + 8.5)));
    }

    this.blackLiquidFront.clear();
    this.blackLiquidFront.fillStyle(0x000000, 0.28);
    this.blackLiquidFront.fillRect(0, surfaceY + 34, THIRD_LEVEL_WIDTH, HEIGHT - surfaceY);
    this.blackLiquidFront.lineStyle(1.6, 0x81755f, 0.2);
    for (let i = 0; i < 28; i += 1) {
      const seed = i * 37.2;
      const y = surfaceY + 32 + this.glitchNoise(seed) * 230;
      const x = this.glitchNoise(seed + 1.7) * THIRD_LEVEL_WIDTH;
      const width = Phaser.Math.Linear(44, 260, this.glitchNoise(seed + 3.4));
      this.blackLiquidFront.beginPath();
      this.blackLiquidFront.moveTo(x, y + Math.sin(t * 0.5 + seed) * 2);
      this.blackLiquidFront.lineTo(x + width, y + Math.sin(t * 0.7 + seed + 1.8) * 2);
      this.blackLiquidFront.strokePath();
    }
  }

  private getBlackLiquidY(x: number, t: number) {
    return (
      THIRD_LEVEL_LIQUID_SURFACE_Y +
      Math.sin(x * 0.014 + t * 0.45) * 3.2 +
      Math.sin(x * 0.037 - t * 0.7) * 1.5
    );
  }

  private updateBlackRoom() {
    const flicker = 0.92 + Math.sin(this.roomPhase * 5.1) * 0.025 + Math.sin(this.roomPhase * 13.7) * 0.018;
    this.tableComputer.setAlpha(flicker);
  }

  private createPrompt() {
    this.promptText = this.add
      .text(WIDTH / 2, HEIGHT - 78, '', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#f1e5ce',
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(100);
  }

  private createDialoguePanel() {
    const panel = this.add.container(0, 0).setDepth(130).setScrollFactor(0).setVisible(false);
    const background = this.add.rectangle(0, HEIGHT - 168, WIDTH, 168, 0x030202, 0.88).setOrigin(0, 0);
    const border = this.add.rectangle(0, HEIGHT - 168, WIDTH, 1, 0xd9c097, 0.34).setOrigin(0, 0);
    this.dialogueSpeakerText = this.add
      .text(42, HEIGHT - 144, '', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#efd8a7',
      })
      .setOrigin(0, 0);
    this.dialogueBodyText = this.add
      .text(42, HEIGHT - 106, '', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#f2eee6',
        wordWrap: { width: WIDTH - 84 },
        lineSpacing: 7,
      })
      .setOrigin(0, 0);
    this.dialogueHintText = this.add
      .text(WIDTH - 42, HEIGHT - 32, 'E / Space', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#8e8068',
      })
      .setOrigin(1, 0.5);

    panel.add([background, border, this.dialogueSpeakerText, this.dialogueBodyText, this.dialogueHintText]);
    this.dialoguePanel = panel;
  }

  private createConfirmPanel() {
    const panel = this.add.container(WIDTH / 2, HEIGHT / 2).setDepth(150).setScrollFactor(0).setVisible(false);
    const shade = this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x000000, 0.58);
    const background = this.add.rectangle(0, 0, 610, 172, 0x080606, 0.94);
    background.setStrokeStyle(1, 0xd2b98f, 0.42);
    const title = this.add
      .text(-270, -58, '信息介质锚定测试', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#efd8a7',
      })
      .setOrigin(0, 0);
    const body = this.add
      .text(-270, -16, '是否确认开启显示器锚定测试？', {
        fontFamily: 'monospace',
        fontSize: '23px',
        color: '#f5eee3',
      })
      .setOrigin(0, 0);
    const hint = this.add
      .text(270, 54, 'E 确认    Space 取消', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#9d8d73',
      })
      .setOrigin(1, 0);

    panel.add([shade, background, title, body, hint]);
    this.confirmPanel = panel;
  }

  private createGlitchLayers() {
    this.glitchOverlay = this.add
      .rectangle(0, 0, WIDTH, HEIGHT, 0x21000b, 1)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(190)
      .setAlpha(0)
      .setVisible(false);
    this.glitchLayer = this.add.graphics().setScrollFactor(0).setDepth(205).setVisible(false);
    this.crtSwitchLayer = this.add.graphics().setScrollFactor(0).setDepth(215).setVisible(false);

    this.laughImage = this.add
      .image(WIDTH / 2, HEIGHT / 2, 'scene3-laugh')
      .setDisplaySize(WIDTH, HEIGHT)
      .setScrollFactor(0)
      .setDepth(200)
      .setVisible(false);
    this.laughRed = this.add
      .image(WIDTH / 2, HEIGHT / 2, 'scene3-laugh')
      .setDisplaySize(WIDTH, HEIGHT)
      .setScrollFactor(0)
      .setTint(0xff0036)
      .setAlpha(0.28)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(201)
      .setVisible(false);
    this.laughCyan = this.add
      .image(WIDTH / 2, HEIGHT / 2, 'scene3-laugh')
      .setDisplaySize(WIDTH, HEIGHT)
      .setScrollFactor(0)
      .setTint(0x00f6ff)
      .setAlpha(0.22)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(202)
      .setVisible(false);
    this.createLaughStickers();

    this.finalBlack = this.add
      .rectangle(0, 0, WIDTH, HEIGHT, 0x000000, 1)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(230)
      .setVisible(false);
    this.finalText = this.add
      .text(WIDTH / 2, HEIGHT / 2, '你也想被锚定吗', {
        fontFamily: 'monospace',
        fontSize: '34px',
        color: '#f1f1f1',
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(231)
      .setAlpha(0)
      .setVisible(false);
  }

  private createLaughStickers() {
    this.laughStickers = [];
    const phrase = '你也想被锚定吗';
    const colors = ['#ff0000', '#d00000', '#ff1d1d', '#a80000', '#ff3b2f'];

    for (let i = 0; i < 180; i += 1) {
      const seed = i * 31.77;
      const x = Phaser.Math.Linear(-180, WIDTH + 180, this.glitchNoise(seed + 1.1));
      const y = Phaser.Math.Linear(-90, HEIGHT + 90, this.glitchNoise(seed + 2.2));
      const size = Math.round(Phaser.Math.Linear(18, 72, Math.pow(this.glitchNoise(seed + 3.3), 1.08)));
      const alpha = Phaser.Math.Linear(0.5, 0.98, this.glitchNoise(seed + 4.4));
      const rotation = this.signedGlitchNoise(seed + 5.5) * 1.05;
      const color = colors[i % colors.length];
      const text = this.add
        .text(x, y, phrase, {
          fontFamily: 'monospace',
          fontSize: `${size}px`,
          fontStyle: '900',
          color,
          stroke: '#190000',
          strokeThickness: Math.max(2, Math.round(size * 0.1)),
          backgroundColor: this.glitchNoise(seed + 6.6) > 0.54 ? 'rgba(12, 0, 0, 0.28)' : undefined,
          padding: { x: 4, y: 2 },
        })
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setDepth(206 + this.glitchNoise(seed + 7.7) * 6)
        .setRotation(rotation)
        .setAlpha(alpha)
        .setVisible(false);
      text.setData('baseX', x);
      text.setData('baseY', y);
      text.setData('baseRotation', rotation);
      text.setData('jitterSeed', seed);
      text.setData('appearDelay', Phaser.Math.Linear(0, SCENE3_LAUGH_STICKER_DURATION_MS * 0.92, this.glitchNoise(seed + 8.8)));
      text.setData('targetAlpha', alpha);
      this.laughStickers.push(text);
    }
  }

  private createControls() {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input is required for this prototype.');
    }

    this.cursors = keyboard.createCursorKeys();
    this.keys = createGameKeyMap(this);
  }

  private handleLevelHotkeys() {
    navigateByLevelHotkey(this, this.keys);
  }

  private startIntroDialogue() {
    this.showDialogue(
      [
        { speaker: '研究员', text: '第三阶段测试不记录在正式档案里。' },
        { speaker: '研究员', text: '本轮介质为 ████。' },
        { speaker: '研究员', text: '沿黑色液体区域前进，抵达中央显示器。' },
        { speaker: '研究员', text: '把 SCP-Anchor 绑定到显示器上。' },
      ],
      () => {
        this.phase = 'readyToBind';
      },
    );
  }

  private showPostBindingDialogue() {
    this.showDialogue(
      [
        { speaker: '研究员', text: '连接稳定。显示器已经成为媒介。' },
        { speaker: '研究员', text: '现在操作终端，确认开始。不要把视线移开。' },
      ],
      () => {
        this.phase = 'readyToOperate';
      },
    );
  }

  private showDialogue(lines: DialogueLine[], onComplete?: () => void) {
    this.dialogueLines = lines;
    this.dialogueIndex = 0;
    this.dialogueActive = true;
    this.dialogueCompleteHandler = onComplete ?? null;
    this.dialoguePanel.setVisible(true);
    this.updateDialogueText();
  }

  private updateDialogueText() {
    const line = this.dialogueLines[this.dialogueIndex];
    if (!line) return;

    this.dialogueSpeakerText.setText(line.speaker);
    this.dialogueBodyText.setText(line.text);
    playDialogueVoice(this, line);
  }

  private updateDialogueInput() {
    if (!this.dialogueActive) return;

    if (isJustDown(this.keys.e, this.keys.space)) {
      this.dialogueInputConsumed = true;
      playSfx(this, 'ui_next', 0.18);
      this.dialogueIndex += 1;
      if (this.dialogueIndex >= this.dialogueLines.length) {
        this.dialogueActive = false;
        this.dialoguePanel.setVisible(false);
        const completeHandler = this.dialogueCompleteHandler;
        this.dialogueCompleteHandler = null;
        completeHandler?.();
      } else {
        this.updateDialogueText();
      }
    }
  }

  private handleComputerInteraction() {
    if (this.confirmVisible) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.e)) {
        playSfx(this, 'ui_confirm', 0.36);
        this.startGlitchSequence();
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        this.hideConfirmPanel();
      }
      return;
    }

    if (
      this.dialogueActive ||
      this.dialogueInputConsumed ||
      this.phase === 'intro' ||
      this.phase === 'bindingAnchor' ||
      this.phase === 'glitch' ||
      this.phase === 'ending'
    ) {
      return;
    }

    const pressedExit = Phaser.Input.Keyboard.JustDown(this.keys.e);
    const pressedInteract = pressedExit || Phaser.Input.Keyboard.JustDown(this.keys.space);
    if (!pressedInteract) return;

    if (this.phase === 'readyToBind') {
      if (pressedExit && this.isNearComputer() && this.anchorCarried) {
        this.bindAnchorToComputer();
        return;
      }

      if (this.anchorCarried) {
        this.dropThirdLevelAnchor();
        return;
      }

      if (this.distanceTo(this.anchor.x, this.anchor.y) < 120) {
        this.anchorCarried = true;
        this.anchorBoundToComputer = false;
        playSfx(this, 'anchor_retrieve', 0.42);
      }
      return;
    }

    if (this.phase === 'readyToOperate' && pressedExit && this.isNearComputer()) {
      this.showConfirmPanel();
    }
  }

  private dropThirdLevelAnchor() {
    this.anchorCarried = false;
    this.anchorBoundToComputer = false;
    const dropDirection = this.facing;
    this.anchor.x = Phaser.Math.Clamp(this.player.x + dropDirection * 76, 40, THIRD_LEVEL_WIDTH - 40);
    this.anchor.y = GROUND_Y - 36;
    playSfx(this, 'anchor_drop_black', 0.5);
  }

  private bindAnchorToComputer() {
    this.phase = 'bindingAnchor';
    this.anchorCarried = false;
    this.promptText.setVisible(false);
    this.cameras.main.shake(180, 0.0018);
    this.anchorRope.clear();
    playSfx(this, 'anchor_bind', 0.48);

    this.tweens.add({
      targets: this.anchor,
      x: THIRD_LEVEL_COMPUTER_ANCHOR_DROP_X,
      y: THIRD_LEVEL_COMPUTER_ANCHOR_DROP_Y,
      scaleX: 0.68,
      scaleY: 0.68,
      rotation: 0,
      alpha: 0.92,
      duration: 780,
      ease: 'Quad.easeInOut',
      onComplete: () => {
        this.anchorBoundToComputer = true;
        this.anchor.setDepth(ANCHOR_SUBMERGED_DEPTH);
        playSfx(this, 'anchor_drop_black', 0.52);
        this.showPostBindingDialogue();
      },
    });
  }

  private showConfirmPanel() {
    this.phase = 'confirm';
    this.confirmVisible = true;
    this.promptText.setVisible(false);
    this.confirmPanel.setVisible(true);
    playSfx(this, 'ui_popup', 0.34);
  }

  private hideConfirmPanel() {
    this.phase = 'readyToOperate';
    this.confirmVisible = false;
    this.confirmPanel.setVisible(false);
    playSfx(this, 'ui_cancel', 0.28);
  }

  private startGlitchSequence() {
    this.phase = 'glitch';
    this.confirmVisible = false;
    this.confirmPanel.setVisible(false);
    this.promptText.setVisible(false);
    this.glitchStartedAt = this.time.now;
    this.glitchOverlay.setFillStyle(0x000000).setVisible(true).setAlpha(1);
    this.glitchLayer.clear().setVisible(false);
    this.setThirdLevelAnchorTint(0xffd2c0);
    this.cameras.main.flash(90, 255, 255, 255);
    playSfx(this, 'crt_switch', 0.52);
    this.startCrtSwitchEffect();

    this.time.delayedCall(SCENE3_CRT_SWITCH_DURATION_MS, () => {
      this.finishCrtSwitchEffect();
      this.startGlitchArtEffect();
    });

    this.time.delayedCall(SCENE3_LAUGH_START_DELAY_MS, () => {
      this.laughImage.setVisible(true).setAlpha(0);
      this.laughRed.setVisible(true);
      this.laughCyan.setVisible(true);
      playMusic(this, 'amb_laugh_noise', 0.38);
      playSfx(this, 'laugh_hit', 0.62);
      this.showLaughStickers();
      this.tweens.add({
        targets: this.laughImage,
        alpha: 1,
        duration: 120,
        ease: 'Quad.easeOut',
      });
      this.cameras.main.flash(180, 255, 255, 255);
      this.cameras.main.shake(1200, 0.02);
    });

    this.time.delayedCall(SCENE3_LAUGH_START_DELAY_MS + SCENE3_LAUGH_STICKER_DURATION_MS, () => this.showFinalBlackScreen());
  }

  private updateGlitchEffect(time: number) {
    if (this.phase !== 'glitch') return;

    const elapsed = time - this.glitchStartedAt;
    const frame = Math.floor(time / 32);
    const progress = Phaser.Math.Clamp(elapsed / (SCENE3_LAUGH_START_DELAY_MS + SCENE3_LAUGH_STICKER_DURATION_MS), 0, 1);
    const pulse = 0.5 + Math.sin(time * 0.058) * 0.5;
    if (this.laughImage.visible) {
      this.glitchOverlay.setFillStyle(frame % 3 === 0 ? 0x160018 : frame % 3 === 1 ? 0x00161b : 0x210005);
      this.glitchOverlay.setAlpha(Phaser.Math.Linear(0.12, 0.38, pulse) * Phaser.Math.Linear(1, 0.62, progress));
    } else {
      this.glitchOverlay.setFillStyle(0x000000);
      this.glitchOverlay.setAlpha(1);
    }

    this.glitchLayer.clear();
    const palette = [0xff0036, 0x00f6ff, 0xfffff0, 0x111111, 0x7200ff, 0xffea00];
    for (let i = 0; i < 72; i += 1) {
      const seed = i * 21.7 + frame * 5.3;
      const noise = this.glitchNoise(seed);
      const x = this.glitchNoise(seed + 1.4) * WIDTH - 120;
      const y = this.glitchNoise(seed + 2.8) * HEIGHT;
      const width = Phaser.Math.Linear(36, WIDTH * 0.82, Math.pow(this.glitchNoise(seed + 4.2), 1.55));
      const height = Phaser.Math.Linear(2, 26, this.glitchNoise(seed + 5.6));
      const color = palette[Math.floor(this.glitchNoise(seed + 7.1) * palette.length) % palette.length];
      const alpha = Phaser.Math.Linear(0.08, 0.58, noise) * Phaser.Math.Linear(0.75, 1.25, pulse);
      this.glitchLayer.fillStyle(color, alpha);
      this.glitchLayer.fillRect(x, y, width, height);
    }

    for (let i = 0; i < 14; i += 1) {
      const seed = i * 44.3 + frame * 3.7;
      const y = this.glitchNoise(seed) * HEIGHT;
      this.glitchLayer.lineStyle(Phaser.Math.Linear(1, 6, this.glitchNoise(seed + 1.2)), 0xffffff, 0.08 + this.glitchNoise(seed + 2.5) * 0.2);
      this.glitchLayer.lineBetween(0, y, WIDTH, y + this.signedGlitchNoise(seed + 3.8) * 18);
    }

    if (this.crtSwitchLayer.visible) {
      this.updateCrtSwitchEffect(time);
    }

    if (this.laughImage.visible) {
      const jitterX = this.signedGlitchNoise(frame * 8.1) * Phaser.Math.Linear(10, 38, pulse);
      const jitterY = this.signedGlitchNoise(frame * 9.7) * Phaser.Math.Linear(5, 22, pulse);
      this.laughImage.setPosition(WIDTH / 2 + jitterX * 0.2, HEIGHT / 2 + jitterY * 0.2);
      this.laughRed.setPosition(WIDTH / 2 + jitterX, HEIGHT / 2 + jitterY * 0.35).setAlpha(0.18 + pulse * 0.24);
      this.laughCyan.setPosition(WIDTH / 2 - jitterX * 0.9, HEIGHT / 2 - jitterY * 0.45).setAlpha(0.16 + (1 - pulse) * 0.22);
      const laughScale = 1 + this.signedGlitchNoise(frame * 4.2) * 0.012;
      this.laughImage.setDisplaySize(WIDTH * laughScale, HEIGHT * laughScale);
      this.laughRed.setDisplaySize(WIDTH * laughScale, HEIGHT * laughScale);
      this.laughCyan.setDisplaySize(WIDTH * laughScale, HEIGHT * laughScale);
      this.updateLaughStickers(frame, pulse);
    }
  }

  private startCrtSwitchEffect() {
    this.crtSwitchStartedAt = this.time.now;
    this.crtSwitchLayer.clear().setVisible(true);
    this.cameras.main.flash(70, 220, 240, 210);
    this.cameras.main.shake(420, 0.006);
  }

  private finishCrtSwitchEffect() {
    this.crtSwitchLayer.clear().setVisible(false);
    this.cameras.main.flash(120, 255, 255, 245);
  }

  private startGlitchArtEffect() {
    this.glitchLayer.clear().setVisible(true);
    this.glitchOverlay.setAlpha(0.24);
    playSfx(this, 'glitch_burst', 0.58);
    playSfx(this, 'glitch_loop', 0.35);
    this.cameras.main.flash(120, 255, 0, 60);
    this.cameras.main.shake(SCENE3_GLITCH_ART_DURATION_MS, 0.012);
  }

  private updateCrtSwitchEffect(time: number) {
    const elapsed = time - this.crtSwitchStartedAt;
    const progress = Phaser.Math.Clamp(elapsed / SCENE3_CRT_SWITCH_DURATION_MS, 0, 1);
    const eased = Phaser.Math.SmoothStep(progress, 0, 1);
    const apertureHeight = Phaser.Math.Linear(2, HEIGHT + 70, eased);
    const top = HEIGHT / 2 - apertureHeight / 2;
    const bottom = HEIGHT / 2 + apertureHeight / 2;
    const linePulse = 0.5 + Math.sin(time * 0.08) * 0.5;

    this.crtSwitchLayer.clear();
    this.crtSwitchLayer.fillStyle(0x000000, 1);
    this.crtSwitchLayer.fillRect(0, 0, WIDTH, HEIGHT);

    this.crtSwitchLayer.fillStyle(0x0a0e0b, 0.34 + linePulse * 0.16);
    this.crtSwitchLayer.fillRect(0, top, WIDTH, apertureHeight);

    this.crtSwitchLayer.lineStyle(Phaser.Math.Linear(2.2, 5.4, 1 - progress), 0xf4fff1, 0.84);
    this.crtSwitchLayer.lineBetween(0, HEIGHT / 2, WIDTH, HEIGHT / 2 + this.signedGlitchNoise(time * 0.021) * 4);
    this.crtSwitchLayer.lineStyle(1.4, 0x78fff5, 0.35 + linePulse * 0.25);
    this.crtSwitchLayer.lineBetween(0, HEIGHT / 2 - 5, WIDTH, HEIGHT / 2 - 3);
    this.crtSwitchLayer.lineStyle(1.4, 0xff2450, 0.22 + (1 - linePulse) * 0.22);
    this.crtSwitchLayer.lineBetween(0, HEIGHT / 2 + 5, WIDTH, HEIGHT / 2 + 3);

    this.crtSwitchLayer.fillStyle(0x000000, 0.92);
    this.crtSwitchLayer.fillRect(0, 0, WIDTH, Math.max(0, top));
    this.crtSwitchLayer.fillRect(0, Math.min(HEIGHT, bottom), WIDTH, Math.max(0, HEIGHT - bottom));

    this.crtSwitchLayer.lineStyle(2, 0xdfffd8, 0.28 + linePulse * 0.22);
    this.crtSwitchLayer.lineBetween(0, top, WIDTH, top + this.signedGlitchNoise(time * 0.03) * 7);
    this.crtSwitchLayer.lineBetween(0, bottom, WIDTH, bottom + this.signedGlitchNoise(time * 0.035 + 9.4) * 7);

    for (let i = 0; i < 38; i += 1) {
      const seed = i * 13.7 + Math.floor(time / 38) * 2.1;
      const y = Phaser.Math.Clamp(top + this.glitchNoise(seed) * apertureHeight, 0, HEIGHT);
      const width = Phaser.Math.Linear(80, WIDTH, this.glitchNoise(seed + 1.4));
      const x = this.glitchNoise(seed + 2.8) * WIDTH - width * 0.35;
      const color = i % 5 === 0 ? 0xffffff : i % 2 === 0 ? 0x79fff7 : 0xff1e4a;
      this.crtSwitchLayer.fillStyle(color, Phaser.Math.Linear(0.04, 0.18, this.glitchNoise(seed + 4.2)) * (1 - progress * 0.35));
      this.crtSwitchLayer.fillRect(x, y, width, Phaser.Math.Linear(1, 5, this.glitchNoise(seed + 5.6)));
    }

    for (let y = Math.max(0, top); y < Math.min(HEIGHT, bottom); y += 8) {
      this.crtSwitchLayer.lineStyle(1, 0x000000, 0.18);
      this.crtSwitchLayer.lineBetween(0, y, WIDTH, y);
    }

    if (progress > 0.82) {
      const burst = Phaser.Math.Clamp((progress - 0.82) / 0.18, 0, 1);
      this.crtSwitchLayer.fillStyle(0xffffff, 0.22 * burst);
      this.crtSwitchLayer.fillRect(0, 0, WIDTH, HEIGHT);
    }
  }

  private showFinalBlackScreen() {
    this.phase = 'ending';
    this.anchorRope.clear();
    this.glitchLayer.clear().setVisible(false);
    this.glitchOverlay.setVisible(false);
    this.laughImage.setVisible(false);
    this.laughRed.setVisible(false);
    this.laughCyan.setVisible(false);
    this.hideLaughStickers();
    this.finalBlack.setVisible(true).setAlpha(1);
    this.finalText.setVisible(false).setAlpha(0);
    this.cameras.main.resetFX();
    stopMusic();
    playSfx(this, 'final_pulse', 0.5);
    this.time.delayedCall(FINAL_SCREEN_HOLD_MS, () => {
      startGameScene(this, 'StartMenuScene');
    });
  }

  private showLaughStickers() {
    this.laughStickers.forEach((text, index) => {
      const targetAlpha = Number(text.getData('targetAlpha')) || Phaser.Math.Linear(0.5, 0.96, this.glitchNoise(index * 13.31));
      const appearDelay = Number(text.getData('appearDelay')) || 0;
      text
        .setVisible(true)
        .setAlpha(0)
        .setScale(Phaser.Math.Linear(0.92, 1.08, this.glitchNoise(index * 9.17)));
      this.tweens.add({
        targets: text,
        alpha: targetAlpha,
        duration: Phaser.Math.Linear(60, 240, this.glitchNoise(index * 17.73)),
        delay: appearDelay,
        ease: 'Quad.easeOut',
      });
      playSfx(this, 'horror_hit', 0.12, {
        delay: appearDelay / 1000,
        detune: Phaser.Math.Between(-160, 80),
      });
    });
  }

  private hideLaughStickers() {
    this.laughStickers.forEach((text) => text.setVisible(false));
  }

  private updateLaughStickers(frame: number, pulse: number) {
    this.laughStickers.forEach((text, index) => {
      if (!text.visible) return;

      const seed = Number(text.getData('jitterSeed')) + frame * 1.91;
      const appearDelay = Number(text.getData('appearDelay')) || 0;
      const stickerElapsed = Math.max(0, this.time.now - this.glitchStartedAt - SCENE3_LAUGH_START_DELAY_MS - appearDelay);
      if (stickerElapsed <= 0) return;

      const baseX = Number(text.getData('baseX'));
      const baseY = Number(text.getData('baseY'));
      const baseRotation = Number(text.getData('baseRotation'));
      const globalProgress = Phaser.Math.Clamp(
        (this.time.now - this.glitchStartedAt - SCENE3_LAUGH_START_DELAY_MS) / SCENE3_LAUGH_STICKER_DURATION_MS,
        0,
        1,
      );
      const jump = this.glitchNoise(seed + 1.4) > Phaser.Math.Linear(0.82, 0.58, globalProgress)
        ? Phaser.Math.Linear(7, 46, this.glitchNoise(seed + 2.8))
        : 0;
      const x = baseX + this.signedGlitchNoise(seed + 3.2) * (3 + pulse * 9 + jump);
      const y = baseY + this.signedGlitchNoise(seed + 4.6) * (2 + pulse * 7 + jump * 0.45);
      const rotation = baseRotation + this.signedGlitchNoise(seed + 5.9) * Phaser.Math.Linear(0.035, 0.09, globalProgress);
      const baseScale = Phaser.Math.Linear(0.92, 1.08, this.glitchNoise(index * 9.17));
      const scale = baseScale + Math.sin(frame * 0.19 + index) * 0.018 * globalProgress;

      text
        .setPosition(x, y)
        .setRotation(rotation)
        .setScale(scale)
        .setAlpha(Phaser.Math.Clamp(text.alpha + this.signedGlitchNoise(seed + index) * 0.04, 0.36, 1));
    });
  }

  private updateAnchor(moving: boolean) {
    if (this.anchorCarried) {
      this.updateThirdLevelCarriedAnchor(moving);
    } else if (this.anchorBoundToComputer || this.phase === 'bindingAnchor') {
      this.updateComputerBoundAnchor();
    } else {
      this.updateThirdLevelDroppedAnchor();
    }
  }

  private updateThirdLevelCarriedAnchor(moving: boolean) {
    this.anchorRope.clear();
    this.anchor.setDepth(ANCHOR_CARRY_DEPTH);
    const hand = this.getCarrierHandPoint(this.player, this.lastPlayerAnim || 'player-idle');
    const t = this.time.now * 0.001;
    const swayX = moving ? Math.sin(t * 6) * 3 : Math.sin(t * 1.6) * 2;

    this.anchor.setScale(ANCHOR_CARRY_SCALE);
    this.anchor.x = hand.x + swayX;
    this.anchor.y = hand.y + 54 * ANCHOR_CARRY_SCALE;
    this.anchor.setRotation(swayX * 0.006);
    this.updateThirdLevelAnchorGlow();
  }

  private updateThirdLevelDroppedAnchor() {
    this.anchorRope.clear();
    this.anchor.setDepth(ANCHOR_SUBMERGED_DEPTH);
    this.anchor.setScale(0.68);

    const ankle = this.getThirdLevelPlayerAnklePoint();
    const distance = Math.abs(ankle.x - this.anchor.x);
    const tensionStart = TETHER_LENGTH * TETHER_SOFT_ZONE;
    const tension = Phaser.Math.Clamp((distance - tensionStart) / (TETHER_LENGTH - tensionStart), 0, 1);
    const pullDirection = Math.sign(ankle.x - this.anchor.x) || this.facing;
    if (tension > 0.64) {
      playThrottledSfx(this, 'anchor_tension', 0.17, 540, {
        detune: Phaser.Math.Between(-90, 30),
      });
    }
    this.anchor.setRotation(this.getThirdLevelAnchoredHookRotation(pullDirection, tension, this.time.now * 0.001));
    const ring = this.getThirdLevelAnchorRingPoint();
    this.drawThirdLevelAnchorRope(ankle.x, ankle.y, ring.x, ring.y, tension, 0.68);
    this.updateThirdLevelAnchorGlow();
  }

  private updateComputerBoundAnchor() {
    this.anchorRope.clear();

    if (this.anchorBoundToComputer) {
      this.anchor.setDepth(ANCHOR_SUBMERGED_DEPTH);
      this.anchor.setScale(0.68);
      this.anchor.setRotation(this.getThirdLevelAnchoredHookRotation(-1, 0.92, this.time.now * 0.001));
      this.anchor.x = THIRD_LEVEL_COMPUTER_ANCHOR_DROP_X;
      this.anchor.y = THIRD_LEVEL_COMPUTER_ANCHOR_DROP_Y;
    }

    const computer = this.getComputerAnchorPoint();
    const ring = this.getThirdLevelAnchorRingPoint();
    const distance = Phaser.Math.Distance.Between(computer.x, computer.y, ring.x, ring.y);
    const tension = Phaser.Math.Clamp(distance / 210, 0.36, 1);
    this.drawThirdLevelAnchorRope(computer.x, computer.y, ring.x, ring.y, tension, 0.82);
    this.updateThirdLevelAnchorGlow();
  }

  private constrainThirdLevelPlayerByDroppedAnchor() {
    const footOffset = this.facing * 8;
    const minX = this.anchor.x - TETHER_LENGTH - footOffset;
    const maxX = this.anchor.x + TETHER_LENGTH - footOffset;
    this.playerWorldX = Phaser.Math.Clamp(this.playerWorldX, minX, maxX);
  }

  private getThirdLevelPlayerAnklePoint() {
    return {
      x: this.playerWorldX + this.facing * 8,
      y: ANKLE_TIE_Y,
    };
  }

  private getComputerAnchorPoint() {
    return {
      x: THIRD_LEVEL_COMPUTER_BIND_X,
      y: THIRD_LEVEL_COMPUTER_BIND_Y,
    };
  }

  private getThirdLevelAnchorRingPoint() {
    const localX = 0;
    const localY = -54 * this.anchor.scaleY;
    const rotation = this.anchor.rotation;
    return {
      x: this.anchor.x + localX * Math.cos(rotation) - localY * Math.sin(rotation),
      y: this.anchor.y + localX * Math.sin(rotation) + localY * Math.cos(rotation),
    };
  }

  private getThirdLevelAnchoredHookRotation(pullDirection: number, tension: number, phase: number) {
    const direction = pullDirection >= 0 ? 1 : -1;
    const bite = Phaser.Math.SmoothStep(tension, 0, 1);
    const idleRock = Math.sin(phase * 1.6 + this.anchor.x * 0.01) * ANCHOR_HOOK_ROTATION_IDLE * (1 - bite);
    return direction * Phaser.Math.Linear(ANCHOR_HOOK_ROTATION_IDLE, ANCHOR_HOOK_ROTATION_MAX, bite) + idleRock;
  }

  private drawThirdLevelAnchorRope(x1: number, y1: number, x2: number, y2: number, tension: number, alpha: number) {
    const slack = 1 - tension;
    const midX = (x1 + x2) * 0.5;
    const midY = (y1 + y2) * 0.5 + slack * 26;
    const lineAlpha = alpha * Phaser.Math.Linear(0.52, 1, tension);
    const lineWidth = Phaser.Math.Linear(2, 3.4, tension);

    this.anchorRope.lineStyle(lineWidth + 2, 0x050505, lineAlpha * 0.62);
    this.anchorRope.beginPath();
    this.anchorRope.moveTo(x1, y1);
    this.anchorRope.lineTo(midX, midY + 2);
    this.anchorRope.lineTo(x2, y2);
    this.anchorRope.strokePath();

    this.anchorRope.lineStyle(lineWidth, tension > 0.55 ? 0xd8d2c4 : 0x8d877b, lineAlpha);
    this.anchorRope.beginPath();
    this.anchorRope.moveTo(x1, y1);
    this.anchorRope.lineTo(midX, midY);
    this.anchorRope.lineTo(x2, y2);
    this.anchorRope.strokePath();

    this.drawThirdLevelRopeHinge(x1, y1, x2, y2, tension, 5.4, 0x8d877b, 0xf1ede4);
    this.drawThirdLevelRopeHinge(x2, y2, x1, y1, tension, 7.2, 0x8d877b, 0xf1ede4);
  }

  private drawThirdLevelRopeHinge(
    x: number,
    y: number,
    towardX: number,
    towardY: number,
    tension: number,
    radius: number,
    metalColor: number,
    highlightColor: number,
  ) {
    const angle = Phaser.Math.Angle.Between(x, y, towardX, towardY);
    const alpha = 0.36 + tension * 0.44;
    const lugLength = radius * 1.25;
    const lugWidth = Phaser.Math.Clamp(radius * 0.46, 2.4, 3.6);
    const lugEndX = x + Math.cos(angle) * lugLength;
    const lugEndY = y + Math.sin(angle) * lugLength;

    this.anchorRope.lineStyle(lugWidth + 2, 0x050505, alpha * 0.68);
    this.anchorRope.lineBetween(x, y, lugEndX, lugEndY);
    this.anchorRope.lineStyle(lugWidth, metalColor, alpha);
    this.anchorRope.lineBetween(x, y, lugEndX, lugEndY);

    this.anchorRope.fillStyle(0x050505, alpha * 0.58);
    this.anchorRope.fillCircle(x + 1.5, y + 2, radius + 2.4);
    this.anchorRope.fillStyle(0x22201d, alpha * 0.82);
    this.anchorRope.fillCircle(x, y, radius + 1.4);
    this.anchorRope.lineStyle(1.4, metalColor, alpha);
    this.anchorRope.strokeCircle(x, y, radius + 1.4);
    this.anchorRope.fillStyle(0x050505, 0.72);
    this.anchorRope.fillCircle(x, y, radius * 0.46);

    this.anchorRope.lineStyle(1, highlightColor, 0.22 + tension * 0.36);
    this.anchorRope.beginPath();
    this.anchorRope.arc(x - radius * 0.24, y - radius * 0.28, radius * 0.72, Math.PI * 1.05, Math.PI * 1.72, false);
    this.anchorRope.strokePath();

    this.anchorRope.fillStyle(highlightColor, 0.28 + tension * 0.18);
    this.anchorRope.fillCircle(x - radius * 0.28, y - radius * 0.34, Math.max(1, radius * 0.18));
  }

  private getCarrierHandPoint(sprite: Phaser.GameObjects.Sprite, animKey: string) {
    const markers = PLAYER_HAND_MARKERS[animKey] ?? PLAYER_HAND_MARKERS['player-idle'];
    const frameIndex = sprite.anims.currentFrame ? sprite.anims.currentFrame.index : 0;
    const safeIndex = ((frameIndex % markers.length) + markers.length) % markers.length;
    const marker = markers[safeIndex];
    const dir = sprite.flipX ? -1 : 1;

    return {
      x: sprite.x + (marker.x - sprite.displayOriginX) * sprite.scaleX * dir,
      y: sprite.y + (marker.y - sprite.displayOriginY) * sprite.scaleY,
    };
  }

  private updateThirdLevelAnchorGlow() {
    const submerged = Phaser.Math.Clamp((this.anchor.y - THIRD_LEVEL_LIQUID_SURFACE_Y + 56) / 120, 0, 1);
    const t = this.time.now * 0.001;
    const pulse = 0.82 + Math.sin(t * 2.2 + this.anchor.x * 0.012) * 0.18;
    this.anchorGlowBack.setVisible(false).setAlpha(0);
    this.anchorGlowCore.setVisible(false).setAlpha(0);

    const silhouetteVisible = !this.anchorCarried && submerged > 0.18;
    this.anchorSilhouette
      .setVisible(silhouetteVisible)
      .setPosition(this.anchor.x, this.anchor.y + 44 * this.anchor.scaleY)
      .setDisplaySize(
        ANCHOR_SPRITE_WIDTH * this.anchor.scaleX * 1.02,
        ANCHOR_SPRITE_HEIGHT * this.anchor.scaleY * 0.9,
      )
      .setRotation(this.anchor.rotation)
      .setAlpha(silhouetteVisible ? Phaser.Math.Linear(0.08, 0.16, submerged) * pulse : 0);
  }

  private setThirdLevelAnchorTint(tint: number) {
    this.anchor.each((child: Phaser.GameObjects.GameObject) => {
      const tintable = child as Phaser.GameObjects.GameObject & { setTint?: (color: number) => void };
      tintable.setTint?.(tint);
    });
  }

  private updatePrompt() {
    if (
      this.dialogueActive ||
      this.confirmVisible ||
      this.phase === 'intro' ||
      this.phase === 'bindingAnchor' ||
      this.phase === 'glitch' ||
      this.phase === 'ending'
    ) {
      this.promptText.setVisible(false);
      return;
    }

    let prompt = '';
    if (this.phase === 'readyToBind') {
      if (this.isNearComputer()) {
        prompt = this.anchorCarried ? 'E  将 SCP-Anchor 绑定到显示器' : '先取回 SCP-Anchor，再进行绑定';
      } else if (this.anchorCarried) {
        prompt = 'E / Space  放下 SCP-Anchor';
      } else if (this.distanceTo(this.anchor.x, this.anchor.y) < 120) {
        prompt = 'E / Space  取回 SCP-Anchor';
      } else {
        prompt = '靠近显示器';
      }
    } else if (this.phase === 'readyToOperate') {
      prompt = this.isNearComputer() ? 'E  操作显示器' : '靠近显示器';
    }

    this.promptText.setText(prompt);
    this.promptText.setVisible(prompt.length > 0);
  }

  private isNearComputer() {
    return Math.abs(this.playerWorldX - THIRD_LEVEL_CENTER_X) <= 230;
  }

  private distanceTo(x: number, y: number) {
    return Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y);
  }

  private glitchNoise(seed: number) {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  }

  private signedGlitchNoise(seed: number) {
    return this.glitchNoise(seed) * 2 - 1;
  }

  private setPlayerAnim(key: string) {
    if (this.lastPlayerAnim === key) return;
    this.player.play(key, true);
    this.applyCharacterPose(this.player, key);
    this.lastPlayerAnim = key;
  }

  private applyCharacterPose(sprite: Phaser.GameObjects.Sprite, animKey: string) {
    const isWalking = animKey === 'player-walk';
    sprite.setDisplayOrigin(isWalking ? WALK_ORIGIN.x : IDLE_ORIGIN.x, isWalking ? WALK_ORIGIN.y : IDLE_ORIGIN.y);
    if (isWalking) {
      sprite.setScale(PLAYER_WALK_SCALE_X, PLAYER_WALK_SCALE_Y);
    } else {
      sprite.setScale(PLAYER_IDLE_SCALE);
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#030507',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [StartMenuScene, PrologueScene, ExploreScene, SecondLevelScene, ThirdLevelScene],
};

new Phaser.Game(config);
