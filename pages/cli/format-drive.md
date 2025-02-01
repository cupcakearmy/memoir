# Format a Drive

## macOS

Some times Disk Utility cannot format a whole drive for some reason.

```
# Check devices
diskutil list

# To exfat
diskutil eraseDisk EXFAT "NAME" GPT /dev/diskN

# To fat32, with mbr
 diskutil eraseDisk FAT32 "NAME" MBR /dev/diskN
```
