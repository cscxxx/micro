import React, { Suspense, lazy, ComponentType } from "react";
import { Spin, Alert } from "antd";

interface RemoteComponentProps {
  moduleName: string;
  fallback?: React.ReactNode;
}

const RemoteComponent: React.FC<RemoteComponentProps> = ({
  moduleName,
  fallback = (
    <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
  ),
}) => {
  const [Component, setComponent] = React.useState<ComponentType | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const loadComponent = async () => {
      try {
        setError(null);
        // 动态导入远程模块
        const module = await import(/* @vite-ignore */ moduleName);
        const Comp = module.default || module;
        setComponent(() => Comp as ComponentType);
      } catch (err) {
        console.error("Failed to load remote module:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      }
    };

    loadComponent();
  }, [moduleName]);

  if (error) {
    return (
      <Alert
        message="远程模块加载失败"
        description={error.message}
        type="error"
        showIcon
        style={{ margin: "24px" }}
      />
    );
  }

  if (!Component) {
    return <>{fallback}</>;
  }

  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
};

export default RemoteComponent;
