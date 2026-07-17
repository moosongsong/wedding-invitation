import { useState } from 'react';
import styles from './App.module.css';
import { EntryOverlay } from './components/common/EntryOverlay';
import { MusicToggle } from './components/common/MusicToggle';
import { Intro } from './components/sections/Intro';
import { Invitation } from './components/sections/Invitation';
import { WeddingDay } from './components/sections/WeddingDay';
import { AboutUs } from './components/sections/AboutUs';
import { Location } from './components/sections/Location';
import { Accounts } from './components/sections/Accounts';
import { Information } from './components/sections/Information';
import { Closing } from './components/sections/Closing';

// 모바일 청첩장 - 세로 스크롤 단일 페이지 구성
function App() {
  const [entered, setEntered] = useState(false);

  return (
    <div className={styles.frame}>
      {!entered && <EntryOverlay onEnter={() => setEntered(true)} />}
      <MusicToggle />
      <Intro />
      <Invitation />
      <WeddingDay />
      <AboutUs />
      <Information />
      <Location />
      <Accounts />
      <Closing />
    </div>
  );
}

export default App;
