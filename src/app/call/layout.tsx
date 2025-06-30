interface Props {
  children: React.ReactNode;
}

const CallLayout = ({ children }: Props) => {
  return <div className="h-screen bg-black">{children}</div>;
};

export default CallLayout;
