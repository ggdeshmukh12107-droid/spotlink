// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SpotLinkLedger
 * @dev Stores booking records on Ethereum Sepolia testnet for tamper-proof transaction logs
 */
contract SpotLinkLedger {
    
    struct BookingRecord {
        string bookingId;
        address user;
        address owner;
        uint256 amount;
        uint256 timestamp;
        string spaceId;
        string status;
    }

    // State variables
    address public admin;
    uint256 public totalRecords;
    
    mapping(uint256 => BookingRecord) public records;
    mapping(string => uint256) public bookingToRecord;
    
    // Events
    event BookingRecorded(
        uint256 indexed recordId,
        string bookingId,
        address indexed user,
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );

    event DisputeRaised(
        uint256 indexed recordId,
        string bookingId,
        address indexed raisedBy,
        string reason
    );

    event BookingStatusUpdated(
        uint256 indexed recordId,
        string newStatus
    );

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        totalRecords = 0;
    }

    /**
     * @dev Record a new booking on the blockchain
     */
    function recordBooking(
        string memory _bookingId,
        address _owner,
        uint256 _amount,
        string memory _spaceId
    ) external returns (uint256) {
        totalRecords++;
        
        records[totalRecords] = BookingRecord({
            bookingId: _bookingId,
            user: msg.sender,
            owner: _owner,
            amount: _amount,
            timestamp: block.timestamp,
            spaceId: _spaceId,
            status: "confirmed"
        });

        bookingToRecord[_bookingId] = totalRecords;

        emit BookingRecorded(
            totalRecords,
            _bookingId,
            msg.sender,
            _owner,
            _amount,
            block.timestamp
        );

        return totalRecords;
    }

    /**
     * @dev Get a booking record by record ID
     */
    function getRecord(uint256 _recordId) external view returns (BookingRecord memory) {
        require(_recordId > 0 && _recordId <= totalRecords, "Record does not exist");
        return records[_recordId];
    }

    /**
     * @dev Get a booking record by booking ID
     */
    function getRecordByBookingId(string memory _bookingId) external view returns (BookingRecord memory) {
        uint256 recordId = bookingToRecord[_bookingId];
        require(recordId > 0, "Booking not found on chain");
        return records[recordId];
    }

    /**
     * @dev Raise a dispute for a booking
     */
    function raiseDispute(uint256 _recordId, string memory _reason) external {
        require(_recordId > 0 && _recordId <= totalRecords, "Record does not exist");
        BookingRecord memory record = records[_recordId];
        require(
            msg.sender == record.user || msg.sender == record.owner,
            "Only booking participants can raise disputes"
        );

        records[_recordId].status = "disputed";

        emit DisputeRaised(_recordId, record.bookingId, msg.sender, _reason);
        emit BookingStatusUpdated(_recordId, "disputed");
    }

    /**
     * @dev Update booking status (admin only)
     */
    function updateStatus(uint256 _recordId, string memory _newStatus) external onlyAdmin {
        require(_recordId > 0 && _recordId <= totalRecords, "Record does not exist");
        records[_recordId].status = _newStatus;
        emit BookingStatusUpdated(_recordId, _newStatus);
    }

    /**
     * @dev Verify a booking exists on chain
     */
    function verifyBooking(string memory _bookingId) external view returns (bool, uint256) {
        uint256 recordId = bookingToRecord[_bookingId];
        return (recordId > 0, recordId);
    }
}
