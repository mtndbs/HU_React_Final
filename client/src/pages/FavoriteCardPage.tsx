import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BuisnessCard from "../components/general/BuisnessCard";
import CardSkeleton from "../components/general/CardSkeleton";
import { Alert, Container } from "@mui/material";
import Title from "../components/general/Title";
import { SearchContext } from "../hooks/SearchContext";
import { Bcard } from "../services/Interfaces";
import { deleteCard, getUserFavoriteCard, toggleFavoriteCard } from "../services/ApiService";
import PageCircle from "../components/general/PageCircle";
function FavoriteCardPage() {
  const [loading, setLoading] = React.useState(true);
  const [cards, setCards] = React.useState<Array<Bcard>>([]);
  const { searchValue } = React.useContext(SearchContext);
  const [filteredData, setFilteredData] = React.useState<Array<Bcard>>([]);

  // Skeleton use effect laoder
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const getData = async () => {
      try {
        getUserFavoriteCard().then((json) => {
          setCards(json.favoriteCards);
          setFilteredData(json.favoriteCards);
        });
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  React.useEffect(() => {
    const filtered = cards.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchValue, cards]);

  const onDelete = async (id: string) => {
    deleteCard(id).then((deleted) => {
      const updated = filteredData.filter((card) => card._id !== id);
      setFilteredData([...updated]);
    });
  };
  const onToggleFavorit = async (id: string) => {
    toggleFavoriteCard(id).then((item) => console.log(item));
  };

  return (
    <>
      <Title mainText="Buisnesses that you liked" />
      {loading && filteredData.length < 1 ? <PageCircle /> : <span></span>}
      <Container>
        <Box>
          <Grid container>
            {filteredData.map((card, index) => (
              <Grid item xs={11} md={4} key={card._id}>
                {loading ? (
                  <CardSkeleton />
                ) : (
                  <BuisnessCard
                    key={card._id}
                    {...card}
                    onDelete={onDelete}
                    onToggleFavorit={onToggleFavorit}
                    favoritePage={true}
                    index={index}
                  />
                )}
              </Grid>
            ))}
            {!loading && cards.length < 1 ? <Alert severity="warning">There are no avialble cards</Alert> : <div></div>}
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default FavoriteCardPage;
