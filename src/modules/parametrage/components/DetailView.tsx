interface viewProps {
  model?: any;
}

const DetailView: React.FC<viewProps> = ({ model }) => {
  return (<>
  
    <span>{model?.id}</span>

  </>);
};
export default DetailView;
