import React, { useState, useEffect } from "react";
import "./styles.css";

// Tipi TypeScript
interface SeatRow {
  seats: boolean[];
  startNumber: number;
}

interface Room {
  name: string;
  rows: Record<string, SeatRow>;
  notes: string;
}

// Funzione per creare una fila di poltrone
const createSeats = (start: number, end: number): SeatRow => ({
  seats: Array.from({ length: start - end + 1 }, () => false),
  startNumber: start,
});

// URL dello script Google Apps
const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbxej2m7Bog7P5VENtY2wzxfXGAhlBAl_Q0JhQqLDUbI-caH3EuHj2EvBQKJCReU43STzg/exec";

// Definizione iniziale delle sale
const initialRooms: Room[] = [
  {
    name: "SALA 1",
    rows: {
      A: createSeats(8, 1),
      B: createSeats(8, 1),
      C: createSeats(8, 1),
      D: createSeats(8, 1),
      E: createSeats(6, 3),
    },
    notes: "",
  },
  {
    name: "SALA 2",
    rows: {
      A: createSeats(12, 1),
      B: createSeats(12, 1),
      C: createSeats(12, 1),
      D: createSeats(12, 1),
      E: createSeats(10, 3),
    },
    notes: "",
  },
  {
    name: "SALA 3",
    rows: {
      A: createSeats(18, 1),
      B: createSeats(18, 1),
      C: createSeats(18, 1),
      D: createSeats(18, 1),
      E: createSeats(16, 3),
    },
    notes: "",
  },
  {
    name: "SALA 4",
    rows: {
      A: createSeats(20, 1),
      B: createSeats(20, 1),
      C: createSeats(20, 1),
      D: createSeats(20, 1),
      E: createSeats(20, 1),
      F: createSeats(18, 3),
    },
    notes: "",
  },
  {
    name: "SALA 5",
    rows: {
      A: createSeats(20, 1),
      B: createSeats(20, 1),
      C: createSeats(20, 1),
      D: createSeats(20, 1),
      E: createSeats(20, 1),
      F: createSeats(18, 3),
    },
    notes: "",
  },
  {
    name: "SALA 6",
    rows: {
      A: createSeats(18, 1),
      B: createSeats(18, 1),
      C: createSeats(18, 1),
      D: createSeats(18, 1),
      E: createSeats(16, 3),
    },
    notes: "",
  },
  {
    name: "SALA 7",
    rows: {
      A: createSeats(12, 1),
      B: createSeats(12, 1),
      C: createSeats(12, 1),
      D: createSeats(12, 1),
      E: createSeats(10, 3),
    },
    notes: "",
  },
];

const App: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(GOOGLE_SHEETS_URL);
        const data = await response.json();
        if (Array.isArray(data)) {
          setRooms(data);
        }
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    };

    fetchRooms();
  }, []);

  const saveRooms = async () => {
    console.log("Salvataggio avviato...");
    setIsSaving(true);
    try {
      console.log("Dati inviati:", JSON.stringify({ rooms }, null, 2));
      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        body: JSON.stringify({ rooms }),
        headers: { "Content-Type": "application/json" },
      });

      const text = await response.text(); // Leggiamo la risposta del server
      console.log("Risposta dal server:", text);

      alert("Dati salvati con successo!");
    } catch (error) {
      console.error("Errore nel salvataggio dei dati:", error);
      alert("Errore nel salvataggio!");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSeat = (roomIndex: number, row: string, seatIndex: number) => {
    setRooms((prevRooms) => {
      return prevRooms.map((room, rIdx) => {
        if (rIdx !== roomIndex) return room; // Se non è la stanza giusta, restituisci quella originale

        return {
          ...room,
          rows: {
            ...room.rows,
            [row]: {
              ...room.rows[row],
              seats: room.rows[row].seats.map((seat, sIdx) =>
                sIdx === seatIndex ? !seat : seat
              ),
            },
          },
        };
      });
    });
  };

  const updateNotes = (roomIndex: number, value: string) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      updatedRooms[roomIndex] = { ...updatedRooms[roomIndex], notes: value };
      return updatedRooms;
    });
  };

  return (
    <div className="App">
      <h1>Gestione Sale e Posti</h1>
      {rooms.map((room, roomIndex) => (
        <div key={room.name} className="room">
          <h2>{room.name}</h2>
          {Object.entries(room.rows).map(([row, rowData]) => (
            <div key={row} className="row">
              <h3>{row}</h3>
              {rowData.seats.map((seat, seatIndex) => (
                <div
                  key={seatIndex}
                  className={`seat ${seat ? "red" : "green"}`}
                  onClick={() => toggleSeat(roomIndex, row, seatIndex)}
                >
                  {`${row}/${rowData.startNumber - seatIndex}`}
                </div>
              ))}
            </div>
          ))}
          <div className="notes">
            <h4>Note per {room.name}</h4>
            <textarea
              value={room.notes}
              onChange={(e) => updateNotes(roomIndex, e.target.value)}
              placeholder="Inserisci note per questa sala..."
            />
          </div>
        </div>
      ))}
      <button onClick={saveRooms} disabled={isSaving}>
        {isSaving ? "Salvando..." : "Salvataggio"}
      </button>
    </div>
  );
};

export default App;
