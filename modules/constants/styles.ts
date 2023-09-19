import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    width: "80%",
    backgroundColor: "#000",
    textTransform: "uppercase",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    text: {
      color: "#fff",
    },
  },
  h1: {
    fontSize: 20,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 18,
  },
  url: {
    fontWeight: "bold",
    color: "blue",
    position: "relative",
    top: 3,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
  },
});

export const gameStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    height: "13%",
  },
  cell: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  cellHeader: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#000",
  },
  cellCorner: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "gray",
  },
  cellText: {
    fontSize: 16,
  },
  cellHeaderText: {
    fontSize: 16,
    color: "#fff",
  },
});

export const gamebarStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    height: "20%",
    gap: 15,
  },
  headerText: {
    fontWeight: "bold",
  },
});
