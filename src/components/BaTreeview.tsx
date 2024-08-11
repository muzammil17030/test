import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useNavigate } from "react-router-dom";
import {signOut, getAuth} from 'firebase/auth'
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: '20px',
  width: '170px',
}));
export default function BATreeView({ treeStructure }: any) {
  const randomId = () => {
    let id = Math.random().toString().slice(2);
    return id;
  };

  const navigate = useNavigate();

  const navigateScreem = (route: string) => {
    navigate(`/dashboard/${route}`);
  };
  const auth=getAuth();
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView>
        {treeStructure && treeStructure.length > 0
          ? treeStructure.map((x: any) => (
              <TreeItem itemId={randomId()} label={x.moduleName}>
                {x.child.map((y: any) => (
                  <TreeItem
                    onClick={() => {
                      navigateScreem(y.route);
                    }}
                    itemId={randomId()}
                    label={y.name}
                  />
                ))}
              </TreeItem>
            ))
          : null}
      </SimpleTreeView>
      <StyledButton 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/login')}
      >
        Login
      </StyledButton>
      <br />
      <StyledButton 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/signup')}
      >
        Signup
      </StyledButton>
      <br />
      <StyledButton 
        variant="contained" 
        color="primary" 
        onClick={()=>{
          signOut(auth).then(() => {
            alert( 'Sign-out successful')
            }).catch((error) => {
              console.log( 'An error happened',error)
            });
          navigate('/login');
        }}
      >
        Log Out
      </StyledButton>
    </Box>
  );
}
