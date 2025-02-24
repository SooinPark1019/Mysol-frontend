import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/userContext";

export default function AutoLogoutWithWarning() {
  const { setUsername } = useUser();
  const router = useRouter();
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    setUsername(null);
    router.push("/login");
  };

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    setShowWarning(false);

    // 비활성 25분 후 경고 메시지 표시
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
    }, 25 * 60 * 1000); // 25분

    // 비활성 30분 후 자동 로그아웃
    inactivityTimer.current = setTimeout(() => {
      handleLogout();
    }, 30 * 60 * 1000); // 30분
  };

  useEffect(() => {
    const activityEvents = ["mousemove", "keydown", "scroll", "click"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, []);

  return (
    showWarning && (
      <div className="fixed bottom-4 right-4 p-4 bg-yellow-500 text-black rounded-lg shadow-lg">
        5분 후 자동 로그아웃됩니다. 활동을 계속하려면 화면을 클릭하세요.
      </div>
    )
  );
}
