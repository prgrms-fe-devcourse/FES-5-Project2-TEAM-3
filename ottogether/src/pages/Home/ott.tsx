// useState 로 선택한 OTT 리스트 정의
 const [ selectedOtt, setSelectedOtt ] = useState<string[]>([]);

// OTT 플랫폼 Toggle 함수
  const handleToggleOtt = (ott:string) => {
    setSelectedOtt(prev => 
      prev.includes(ott)
      ? prev.filter(o => o !== ott)
      : [...prev, ott]
    );
  };

// return JSX에 이런 식으로 넣으시면 됩니다!
      (<OttSelector selected={selectedOtt} onToggle={onToggleOtt} />)