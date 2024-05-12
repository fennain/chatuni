interface Props {
  milliseconds: number;
}

const MillisecondsToDuration: React.FC<Props> = ({ milliseconds }) => {
  const millisecondsPerHour = 60 * 60 * 1000;
  const hours = Math.floor(milliseconds / millisecondsPerHour);
  const remainingMilliseconds = milliseconds % millisecondsPerHour;
  const minutes = Math.floor(remainingMilliseconds / (60 * 1000));
  const seconds = Math.floor((remainingMilliseconds % (60 * 1000)) / 1000);

  return (
    <div>
      {hours > 0 && (
        <>
          <span className="text-[30px]">{hours}</span>小时
        </>
      )}
      {minutes > 0 && (
        <>
          <span className="text-[30px]">{minutes}</span>分钟
        </>
      )}
      {seconds > 0 && (
        <>
          <span className="text-[30px]">{seconds}</span>秒
        </>
      )}
      {milliseconds < 1000 && (
        <>
          <span className="text-[30px]">0</span>秒
        </>
      )}
    </div>
  );
};

export default MillisecondsToDuration;
