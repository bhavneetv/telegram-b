import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Free"); // "Free" | "Lite (Free 1hr)" | "Lite Paid" | "Premium"
  const [referralTimeLeft, setReferralTimeLeft] = useState(3600); // 3600 seconds = 60 mins
  const [favourites, setFavourites] = useState(["tb-101", "tb-104"]);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  
  // Session-based channel verification (resets on page reload)
  const [isChannelJoined, setIsChannelJoined] = useState(() => {
    return sessionStorage.getItem('tb_channel_joined') === 'true';
  });
  
  const [userProfile, setUserProfile] = useState({
    username: "AlexDeveloper",
    referrals: 45,
    credits: 82,
    referralLink: "https://t.me/TeraboxMiniBot?start=ref_alex88"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFavouritesOnlyFilter, setIsFavouritesOnlyFilter] = useState(false);

  // Sync isChannelJoined state to sessionStorage
  const setChannelJoinedState = (status) => {
    setIsChannelJoined(status);
    sessionStorage.setItem('tb_channel_joined', status ? 'true' : 'false');
  };

  // Sync theme class on <body> or root container when isPremium changes
  useEffect(() => {
    if (isPremium) {
      document.documentElement.classList.add('theme-premium');
    } else {
      document.documentElement.classList.remove('theme-premium');
    }
  }, [isPremium]);

  // Referral 1-Hour Timer countdown
  useEffect(() => {
    if (currentPlan === "Lite (Free 1hr)" && referralTimeLeft > 0) {
      const timer = setInterval(() => {
        setReferralTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCurrentPlan("Free");
            setIsPremium(false);
            toast.info("Your 1-hour free access window has ended.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentPlan, referralTimeLeft]);

  // Trigger right-side popup on video play
  const triggerVideoPlayNotification = () => {
    setShowCreditPopup(true);
    if (!isPremium) {
      setUserProfile((prev) => ({
        ...prev,
        credits: Math.max(0, prev.credits - 1)
      }));
    }

    setTimeout(() => {
      setShowCreditPopup(false);
    }, 4500);
  };

  const toggleFavourite = (id) => {
    setFavourites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        toast.info("Removed from favourites");
        return prev.filter((item) => item !== id);
      } else {
        toast.success("Added to favourites!");
        return [...prev, id];
      }
    });
  };

  const deleteFavourite = (id) => {
    setFavourites((prev) => prev.filter((item) => item !== id));
    toast.info("Item removed");
  };

  const clearAllFavourites = () => {
    setFavourites([]);
    toast.info("All favourites cleared");
  };

  const activatePlan = (planName) => {
    if (planName.includes("Free")) {
      setCurrentPlan("Lite (Free 1hr)");
      setReferralTimeLeft(3600); // 60 mins
      setIsPremium(true);
      toast.success("🎉 1-Hour Free HD Access Activated!");
    } else {
      setCurrentPlan(planName);
      setIsPremium(true);
      toast.success(`🎉 ${planName} Activated! Premium Gold Unlocked.`);
    }
  };

  return (
    <AppStateContext.Provider
      value={{
        isPremium,
        setIsPremium,
        currentPlan,
        setCurrentPlan,
        referralTimeLeft,
        favourites,
        toggleFavourite,
        deleteFavourite,
        clearAllFavourites,
        isChannelJoined,
        setIsChannelJoined: setChannelJoinedState,
        userProfile,
        setUserProfile,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isFavouritesOnlyFilter,
        setIsFavouritesOnlyFilter,
        activatePlan,
        showCreditPopup,
        setShowCreditPopup,
        triggerVideoPlayNotification
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
