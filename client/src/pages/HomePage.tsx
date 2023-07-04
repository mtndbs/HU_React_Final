import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BuisnessCard from "../components/general/BuisnessCard";
import CardSkeleton from "../components/general/CardSkeleton";
import { Alert, Container } from "@mui/material";
import Title from "../components/general/Title";
import { SearchContext } from "../hooks/SearchContext";
import { Bcard } from "../services/Interfaces";
import { deleteCard, getCards, toggleFavoriteCard } from "../services/ApiService";
import { toast } from "react-toastify";
import { UserContext } from "../hooks/UserContext";
function HomePage() {
  const [loading, setLoading] = React.useState(true);
  const [cards, setCards] = React.useState<Array<Bcard>>([]);
  const { searchValue } = React.useContext(SearchContext);
  const [filteredData, setFilteredData] = React.useState<Array<Bcard>>([]);

  const { userData } = React.useContext(UserContext);

  // Skeleton use effect laoder
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const getData = async () => {
      getCards()
        .then((json) => {
          setCards(json);
          setFilteredData(json);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getData();
  }, [userData]);

  React.useEffect(() => {
    const filtered = cards.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchValue, cards]);

  const onDelete = async (id: string) => {
    deleteCard(id).then(() => {
      // eslint-disable-next-line array-callback-return
      const updated = filteredData.filter((card) => {
        if (card._id === id) {
          toast.success(`${card.title} deleted succesfully!`);
        }
        if (card._id !== id) {
          return card;
        }
      });
      setFilteredData([...updated]);
    });
  };
  const onToggleFavorit = async (id: string) => {
    toggleFavoriteCard(id).then((item) => {
      item.status
        ? toast.success(`${item.title} Card added to favorite!`)
        : toast.info(`${item.title} Card removed from favorite!`);
    });
  };

  return (
    <>
      <Title mainText="Welcome To BuisCase" subText="Choose your case with our top buisnesses" />
      <Container>
        <Box>
          <Grid container spacing={2}>
            {filteredData &&
              filteredData.map((card, index) => (
                <Grid item xs={11} sm={6} md={4} key={card._id}>
                  {loading ? (
                    <CardSkeleton />
                  ) : (
                    <BuisnessCard
                      key={card._id}
                      {...card}
                      onDelete={onDelete}
                      onToggleFavorit={onToggleFavorit}
                      favoritePage={false}
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

export default HomePage;
