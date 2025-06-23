interface AuthProps {
    children: React.ReactNode;
}

const AuthLayout = ({children}: AuthProps) => {
  return (
    <div className="bg-muted min-h-svh flex flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
