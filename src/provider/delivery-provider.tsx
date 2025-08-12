import { createContext, type ReactNode, use, useState } from 'react';

type DeliveryMethod = 'Express' | 'Premium';

type DeliveryContextType = {
  selectedDeliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
};

const DeliveryContext = createContext<DeliveryContextType>({
  selectedDeliveryMethod: 'Express',
  setDeliveryMethod: () => {},
});

export const DeliveryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethod>('Express');

  const setDeliveryMethod = (method: DeliveryMethod) => {
    setSelectedDeliveryMethod(method);
  };

  return (
    <DeliveryContext.Provider
      value={{
        selectedDeliveryMethod,
        setDeliveryMethod,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = use(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};
